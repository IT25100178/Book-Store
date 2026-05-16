package com.bookstore.admin;

import com.bookstore.admin.model.*;
import com.bookstore.admin.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class AdminApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(JsonStorageUtil storage, 
                                      BookManager bookManager, 
                                      UserManager userManager, 
                                      OrderManager orderManager,
                                      AuthorManager authorManager,
                                      GenreManager genreManager) {
        return args -> {
            // Seed data if files are empty
            List<Book> books = storage.readBooks();
            if (books.isEmpty()) {
                books.add(new Book("Madol Doova", "Martin Wickramasinghe", "9789552017366", "Fiction", 12.50, 45, "A classic coming-of-age story set in southern Sri Lanka.", ""));
                books.add(new Book("Gamperaliya", "Martin Wickramasinghe", "9789552017373", "Fiction", 14.00, 30, "The transformation of a Sri Lankan village.", ""));
                books.add(new Book("Kaliyugaya", "Martin Wickramasinghe", "9789552017380", "Fiction", 13.50, 20, "Sequel to Gamperaliya.", ""));
                books.add(new Book("Revolt in the Temple", "D.C. Vijayavardhana", "9789559590404", "History", 18.00, 10, "A historical look at Sri Lankan society.", ""));
                books.add(new Book("Running in the Family", "Michael Ondaatje", "9780679746690", "Memoir", 15.99, 25, "A fictionalized memoir of Ondaatje's family in Ceylon.", ""));
                
                for(Book b : books) {
                    bookManager.add(b);
                }
            }

            List<Author> authors = storage.readAuthors();
            if (authors.isEmpty()) {
                List<Book> allBooks = bookManager.getAll();
                List<String> mwBooks = new ArrayList<>();
                List<String> moBooks = new ArrayList<>();
                for(Book b : allBooks) {
                    if (b.getAuthor().equals("Martin Wickramasinghe")) mwBooks.add(b.getId());
                    if (b.getAuthor().equals("Michael Ondaatje")) moBooks.add(b.getId());
                }
                
                authorManager.add(new Author("a1", "Martin Wickramasinghe", "Considered the father of modern Sinhala literature.", "Sri Lankan", 1890, "", mwBooks));
                authorManager.add(new Author("a2", "Michael Ondaatje", "A Sri Lankan-born Canadian poet and novelist.", "Canadian-Sri Lankan", 1943, "", moBooks));
                authorManager.add(new Author("a3", "Sybil Wettasinghe", "A well-known children's book author and illustrator.", "Sri Lankan", 1927, "", new ArrayList<>()));
            }

            List<Genre> genres = storage.readGenres();
            if (genres.isEmpty()) {
                List<Book> allBooks = bookManager.getAll();
                List<String> ficBooks = new ArrayList<>();
                List<String> memBooks = new ArrayList<>();
                for(Book b : allBooks) {
                    if (b.getCategory().equals("Fiction")) ficBooks.add(b.getId());
                    if (b.getCategory().equals("Memoir")) memBooks.add(b.getId());
                }
                
                genreManager.add(new Genre("g1", "Fiction", "Imaginative or invented stories.", ficBooks, "#3B82F6"));
                genreManager.add(new Genre("g2", "Memoir", "A historical account based on personal knowledge.", memBooks, "#8B5CF6"));
                genreManager.add(new Genre("g3", "History", "The study of past events.", new ArrayList<>(), "#EAB308"));
            }

            List<User> users = storage.readUsers();
            if (users.isEmpty()) {
                List<User> seededUsers = new ArrayList<>();
                seededUsers.add(new User("Admin User", "admin@bookstore.com", "ADMIN", "ACTIVE"));
                seededUsers.add(new User("John Doe", "john@example.com", "MEMBER", "ACTIVE"));
                seededUsers.add(new User("Jane Smith", "jane@example.com", "MEMBER", "ACTIVE"));
                seededUsers.add(new User("Bob Brown", "bob@example.com", "MEMBER", "BANNED"));
                seededUsers.add(new User("Alice Green", "alice@example.com", "MEMBER", "ACTIVE"));
                storage.writeUsers(seededUsers);
                // Reload in manager
                userManager.init();
            }

            List<Order> orders = storage.readOrders();
            if (orders.isEmpty()) {
                List<Order> seededOrders = new ArrayList<>();
                List<Book> allBooks = bookManager.getAll();
                List<User> allUsers = userManager.getAll();
                
                if(!allBooks.isEmpty() && !allUsers.isEmpty()) {
                    for(int i=0; i<8; i++) {
                        List<String> bookIds = new ArrayList<>();
                        bookIds.add(allBooks.get(i % allBooks.size()).getId());
                        String status = i % 3 == 0 ? "PENDING" : (i % 2 == 0 ? "DELIVERED" : "SHIPPED");
                        seededOrders.add(new Order(
                            allUsers.get(i % allUsers.size()).getId(), 
                            bookIds, 
                            allBooks.get(i % allBooks.size()).getPrice(), 
                            status, 
                            LocalDateTime.now().minusDays(i).toString()
                        ));
                    }
                    storage.writeOrders(seededOrders);
                    orderManager.init();
                }
            }
        };
    }
}
