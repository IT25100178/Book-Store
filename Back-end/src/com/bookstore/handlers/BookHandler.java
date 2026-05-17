package com.bookstore.handlers;

import com.bookstore.models.Book;
import com.bookstore.models.Review;
import com.bookstore.server.BaseHandler;
import com.bookstore.services.BookService;
import com.bookstore.services.UserService;
import com.bookstore.storage.FileStorage;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * BookHandler – Members 2 (Deepika) + 3 (Yuvaniya) + 7 (Vishahan)
 *
 * Routes:
 *   GET    /api/books                        → list / search / filter / sort / paginate
 *   GET    /api/books/categories             → distinct category list
 *   GET    /api/books/{id}                   → single book details
 *   GET    /api/books/{id}/reviews           → reviews for a book
 *   POST   /api/books/{id}/reviews           → add a review
 *   POST   /api/books                        → admin: add book
 *   PUT    /api/books/{id}                   → admin: edit book
 *   DELETE /api/books/{id}                   → admin: delete book
 */
public class BookHandler extends BaseHandler {

    private final BookService bookService = new BookService();
    private final UserService userService = new UserService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handlePreflight(exchange)) return;

        String path   = exchange.getRequestURI().getPath(); // /api/books/...
        String method = exchange.getRequestMethod().toUpperCase();

        // Strip /api/books prefix
        String sub = path.replaceFirst("^/api/books", ""); // "", "/{id}", "/{id}/reviews", "/categories"

        try {
            if (sub.isEmpty() || sub.equals("/")) {
                // /api/books
                switch (method) {
                    case "GET"  -> handleList(exchange);
                    case "POST" -> handleAddBook(exchange);
                    default     -> sendMethodNotAllowed(exchange);
                }

            } else if (sub.equals("/categories")) {
                if ("GET".equals(method)) handleCategories(exchange);
                else sendMethodNotAllowed(exchange);

            } else if (sub.matches("/[^/]+/reviews")) {
                // /api/books/{id}/reviews
                String bookId = sub.split("/")[1];
                switch (method) {
                    case "GET"  -> handleGetReviews(exchange, bookId);
                    case "POST" -> handleAddReview(exchange, bookId);
                    default     -> sendMethodNotAllowed(exchange);
                }

            } else if (sub.matches("/[^/]+")) {
                // /api/books/{id}
                String bookId = sub.substring(1);
                switch (method) {
                    case "GET"    -> handleGetBook(exchange, bookId);
                    case "PUT"    -> handleUpdateBook(exchange, bookId);
                    case "DELETE" -> handleDeleteBook(exchange, bookId);
                    default       -> sendMethodNotAllowed(exchange);
                }

            } else {
                sendNotFound(exchange, "Endpoint");
            }
        } catch (Exception e) {
            sendError(exchange, 500, "Internal error: " + e.getMessage());
        }
    }

    // ── GET /api/books ─────────────────────────────────────────────────────────

    private void handleList(HttpExchange exchange) throws IOException {
        Map<String, String> q = parseQuery(exchange.getRequestURI().getRawQuery());

        String search   = q.getOrDefault("search", "");
        String category = q.getOrDefault("category", "All");
        String sortBy   = q.getOrDefault("sortBy", "");
        int    page     = parseIntOrDefault(q.get("page"), 1);
        int    pageSize = parseIntOrDefault(q.get("pageSize"), 9);

        Map<String, Object> result = bookService.search(search, category, sortBy, page, pageSize);

        @SuppressWarnings("unchecked")
        List<Book> books = (List<Book>) result.get("books");
        List<String> bookJsons = books.stream()
            .map(Book::toJson)
            .collect(Collectors.toList());

        String json = "{"
            + "\"total\":"      + result.get("total")      + ","
            + "\"page\":"       + result.get("page")       + ","
            + "\"pageSize\":"   + result.get("pageSize")   + ","
            + "\"totalPages\":" + result.get("totalPages") + ","
            + "\"books\":"      + toJsonArray(bookJsons)
            + "}";

        sendSuccess(exchange, json);
    }

    // ── GET /api/books/categories ─────────────────────────────────────────────

    private void handleCategories(HttpExchange exchange) throws IOException {
        List<String> cats = bookService.getCategories();
        String json = "[" + cats.stream()
            .map(c -> "\"" + c + "\"")
            .collect(Collectors.joining(",")) + "]";
        sendSuccess(exchange, json);
    }

    // ── GET /api/books/{id} ────────────────────────────────────────────────────

    private void handleGetBook(HttpExchange exchange, String bookId) throws IOException {
        Book book = bookService.findById(bookId);
        if (book == null) { sendNotFound(exchange, "Book"); return; }
        sendSuccess(exchange, book.toJson());
    }

    // ── GET /api/books/{id}/reviews ────────────────────────────────────────────

    private void handleGetReviews(HttpExchange exchange, String bookId) throws IOException {
        List<Review> reviews = userService.getReviewsByBook(bookId);
        List<String> jsons  = reviews.stream().map(Review::toJson).collect(Collectors.toList());
        sendSuccess(exchange, toJsonArray(jsons));
    }

    // ── POST /api/books/{id}/reviews ───────────────────────────────────────────

    private void handleAddReview(HttpExchange exchange, String bookId) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String userId   = data.get("userId");
        String userName = data.getOrDefault("userName", "Anonymous");
        int    rating   = parseIntOrDefault(data.get("rating"), 0);
        String comment  = data.get("comment");

        Map<String, Object> result = userService.addReview(userId, bookId, rating, comment, userName);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendCreated(exchange, "{\"success\":true,\"message\":\"" +
                result.get("message") + "\",\"review\":" + result.get("review") + "}");
        } else {
            sendBadRequest(exchange, (String) result.get("message"));
        }
    }

    // ── POST /api/books (admin) ────────────────────────────────────────────────

    private void handleAddBook(HttpExchange exchange) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        Book book = mapToBook(data, null);
        Map<String, Object> result = bookService.addBook(book);
        sendCreated(exchange, "{\"success\":true,\"message\":\"" +
            result.get("message") + "\",\"book\":" + result.get("book") + "}");
    }

    // ── PUT /api/books/{id} (admin) ────────────────────────────────────────────

    private void handleUpdateBook(HttpExchange exchange, String bookId) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        Map<String, Object> result = bookService.updateBook(bookId, data);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendNotFound(exchange, "Book");
        }
    }

    // ── DELETE /api/books/{id} (admin) ────────────────────────────────────────

    private void handleDeleteBook(HttpExchange exchange, String bookId) throws IOException {
        Map<String, Object> result = bookService.deleteBook(bookId);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendNotFound(exchange, "Book");
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Book mapToBook(Map<String, String> data, String id) {
        Book b = new Book();
        b.setId(id != null ? id : "");
        b.setTitle(data.getOrDefault("title", ""));
        b.setAuthor(data.getOrDefault("author", ""));
        b.setPrice(parseDoubleOrDefault(data.get("price"), 0));
        b.setOriginalPrice(parseDoubleOrDefault(data.get("originalPrice"), 0));
        b.setRating(parseDoubleOrDefault(data.get("rating"), 0));
        b.setCategory(data.getOrDefault("category", ""));
        b.setDescription(data.getOrDefault("description", ""));
        b.setStock(parseIntOrDefault(data.get("stock"), 0));
        b.setNew(Boolean.parseBoolean(data.getOrDefault("isNew", "false")));
        b.setBestseller(Boolean.parseBoolean(data.getOrDefault("isBestseller", "false")));
        b.setPages(parseIntOrDefault(data.get("pages"), 0));
        b.setYear(parseIntOrDefault(data.get("year"), 0));
        b.setImage(data.getOrDefault("image", "📖"));
        return b;
    }

    private int    parseIntOrDefault(String s, int def) {
        try { return s != null ? Integer.parseInt(s.trim()) : def; }
        catch (NumberFormatException e) { return def; }
    }
    private double parseDoubleOrDefault(String s, double def) {
        try { return s != null ? Double.parseDouble(s.trim()) : def; }
        catch (NumberFormatException e) { return def; }
    }
}
