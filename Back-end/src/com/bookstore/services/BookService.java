package com.bookstore.services;

import com.bookstore.models.Book;
import com.bookstore.storage.FileStorage;

import java.util.*;
import java.util.stream.*;

/**
 * BookService – Members 2 (Deepika) + 3 (Yuvaniya) + 7 (Vishahan)
 *
 * Provides: list all, search, filter, sort, get by id, CRUD (admin).
 * All books are stored in Back-end/data/books.txt
 */
public class BookService {

    private static final String FILE = "books.txt";

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Book> getAllBooks() {
        List<Book> books = new ArrayList<>();
        for (String line : FileStorage.readLines(FILE)) {
            Book b = Book.fromFileLine(line);
            if (b != null) books.add(b);
        }
        return books;
    }

    public Book findById(String id) {
        for (Book b : getAllBooks()) {
            if (b.getId().equals(id)) return b;
        }
        return null;
    }

    // ── Search / Filter / Sort ────────────────────────────────────────────────

    /**
     * Member 2 – Deepika
     * Returns books filtered by search term, category, sorted by field.
     *
     * @param search   keyword matched against title, author, description
     * @param category "All" or specific category
     * @param sortBy   "price_asc" | "price_desc" | "rating_asc" | "rating_desc"
     * @param page     1-based page number
     * @param pageSize number of items per page (default 9)
     */
    public Map<String, Object> search(String search, String category,
                                      String sortBy, int page, int pageSize) {
        List<Book> books = getAllBooks();

        // ── Filter by search ──────────────────────────────────────────────────
        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            books = books.stream().filter(b ->
                b.getTitle().toLowerCase().contains(q) ||
                b.getAuthor().toLowerCase().contains(q) ||
                b.getDescription().toLowerCase().contains(q)
            ).collect(Collectors.toList());
        }

        // ── Filter by category ────────────────────────────────────────────────
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            books = books.stream()
                .filter(b -> b.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
        }

        // ── Sort ──────────────────────────────────────────────────────────────
        if (sortBy != null) {
            switch (sortBy) {
                case "price_asc"    -> books.sort(Comparator.comparingDouble(Book::getPrice));
                case "price_desc"   -> books.sort(Comparator.comparingDouble(Book::getPrice).reversed());
                case "rating_asc"   -> books.sort(Comparator.comparingDouble(Book::getRating));
                case "rating_desc"  -> books.sort(Comparator.comparingDouble(Book::getRating).reversed());
                default -> {}   // no sort / title default
            }
        }

        int total = books.size();

        // ── Paginate ──────────────────────────────────────────────────────────
        int fromIndex = Math.max(0, (page - 1) * pageSize);
        int toIndex   = Math.min(total, fromIndex + pageSize);
        List<Book> paged = (fromIndex < total) ? books.subList(fromIndex, toIndex) : Collections.emptyList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total", total);
        result.put("page", page);
        result.put("pageSize", pageSize);
        result.put("totalPages", (int) Math.ceil((double) total / pageSize));
        result.put("books", paged);
        return result;
    }

    /** Returns all distinct category names */
    public List<String> getCategories() {
        Set<String> cats = new LinkedHashSet<>();
        cats.add("All");
        for (Book b : getAllBooks()) cats.add(b.getCategory());
        return new ArrayList<>(cats);
    }

    // ── CRUD – Admin (Member 7 – Vishahan) ────────────────────────────────────

    public Map<String, Object> addBook(Book book) {
        Map<String, Object> result = new LinkedHashMap<>();
        String id = "BK" + System.currentTimeMillis();
        book.setId(id);
        FileStorage.appendLine(FILE, book.toFileLine());
        result.put("success", true);
        result.put("message", "Book added successfully");
        result.put("book", book.toJson());
        return result;
    }

    public Map<String, Object> updateBook(String id, Map<String, String> fields) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Book> books = getAllBooks();
        boolean found = false;
        List<String> lines = new ArrayList<>();

        for (Book b : books) {
            if (b.getId().equals(id)) {
                found = true;
                if (fields.containsKey("title"))       b.setTitle(fields.get("title"));
                if (fields.containsKey("author"))      b.setAuthor(fields.get("author"));
                if (fields.containsKey("price"))       b.setPrice(Double.parseDouble(fields.get("price")));
                if (fields.containsKey("originalPrice")) b.setOriginalPrice(Double.parseDouble(fields.get("originalPrice")));
                if (fields.containsKey("category"))    b.setCategory(fields.get("category"));
                if (fields.containsKey("description")) b.setDescription(fields.get("description"));
                if (fields.containsKey("stock"))       b.setStock(Integer.parseInt(fields.get("stock")));
                if (fields.containsKey("pages"))       b.setPages(Integer.parseInt(fields.get("pages")));
                if (fields.containsKey("year"))        b.setYear(Integer.parseInt(fields.get("year")));
                if (fields.containsKey("image"))       b.setImage(fields.get("image"));
                if (fields.containsKey("isNew"))       b.setNew(Boolean.parseBoolean(fields.get("isNew")));
                if (fields.containsKey("isBestseller")) b.setBestseller(Boolean.parseBoolean(fields.get("isBestseller")));
            }
            lines.add(b.toFileLine());
        }

        if (!found) {
            result.put("success", false);
            result.put("message", "Book not found");
            return result;
        }

        FileStorage.writeLines(FILE, lines);
        result.put("success", true);
        result.put("message", "Book updated successfully");
        return result;
    }

    public Map<String, Object> deleteBook(String id) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Book> books = getAllBooks();
        int before = books.size();
        books.removeIf(b -> b.getId().equals(id));

        if (books.size() == before) {
            result.put("success", false);
            result.put("message", "Book not found");
            return result;
        }

        List<String> lines = new ArrayList<>();
        for (Book b : books) lines.add(b.toFileLine());
        FileStorage.writeLines(FILE, lines);

        result.put("success", true);
        result.put("message", "Book deleted successfully");
        return result;
    }

    /** Decrease stock by quantity after purchase */
    public void decreaseStock(String bookId, int quantity) {
        List<Book> books = getAllBooks();
        List<String> lines = new ArrayList<>();
        for (Book b : books) {
            if (b.getId().equals(bookId)) {
                int newStock = Math.max(0, b.getStock() - quantity);
                b.setStock(newStock);
            }
            lines.add(b.toFileLine());
        }
        FileStorage.writeLines(FILE, lines);
    }
}
