package com.luxurybooks.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.luxurybooks.dsa.CustomHashMap;
import com.luxurybooks.model.Author;
import com.luxurybooks.model.BookStoreItem;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class JsonStorageService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final CustomHashMap<Integer, BookStoreItem> bookCache = new CustomHashMap<>();
    private final CustomHashMap<String, Author> authorCache = new CustomHashMap<>();

    private File booksFile;
    private File authorsFile;

    @PostConstruct
    public void init() {
        try {
            // Copy db files from classpath/resources to local temp directory for read/write capability
            Path tempDir = Files.createTempDirectory("bookstore-db");
            
            Path booksTempPath = tempDir.resolve("books_db.json");
            Files.copy(new ClassPathResource("books_db.json").getInputStream(), booksTempPath, StandardCopyOption.REPLACE_EXISTING);
            booksFile = booksTempPath.toFile();

            Path authorsTempPath = tempDir.resolve("authors_db.json");
            Files.copy(new ClassPathResource("authors_db.json").getInputStream(), authorsTempPath, StandardCopyOption.REPLACE_EXISTING);
            authorsFile = authorsTempPath.toFile();

            loadData();
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize database files", e);
        }
    }

    private void loadData() {
        try {
            // Load Books
            List<BookStoreItem> books = objectMapper.readValue(booksFile, new TypeReference<List<BookStoreItem>>() {});
            for (BookStoreItem book : books) {
                bookCache.put(book.getId(), book);
            }

            // Load Authors
            List<Author> authors = objectMapper.readValue(authorsFile, new TypeReference<List<Author>>() {});
            for (Author author : authors) {
                authorCache.put(author.getId(), author);
            }

            System.out.println("Loaded " + bookCache.size() + " books and " + authorCache.size() + " authors into Custom HashMap caches.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public synchronized void saveBooks() {
        try {
            List<BookStoreItem> books = bookCache.values();
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(booksFile, books);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // O(1) Lookups using Custom HashMap
    public BookStoreItem getBook(int id) {
        return bookCache.get(id);
    }

    public Author getAuthor(String authorId) {
        return authorCache.get(authorId);
    }

    public List<BookStoreItem> getAllBooks() {
        return bookCache.values();
    }

    public List<Author> getAllAuthors() {
        return authorCache.values();
    }
}
