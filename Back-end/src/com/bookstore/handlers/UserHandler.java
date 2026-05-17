package com.bookstore.handlers;

import com.bookstore.models.Book;
import com.bookstore.models.User;
import com.bookstore.models.WishlistItem;
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
 * UserHandler – Members 6 (Vishok) + 7 (Vishahan)
 *
 * Routes:
 *   GET    /api/users/{id}                  → get profile
 *   PUT    /api/users/{id}                  → update profile
 *   POST   /api/users/{id}/change-password  → change password
 *   GET    /api/users/{id}/wishlist         → get wishlist
 *   POST   /api/users/{id}/wishlist         → add to wishlist
 *   DELETE /api/users/{id}/wishlist/{bookId} → remove from wishlist
 *   GET    /api/users/{id}/reviews          → get user's reviews
 *   GET    /api/users                       → admin: all users
 *   DELETE /api/users/{id}                  → admin: delete user
 */
public class UserHandler extends BaseHandler {

    private final UserService userService = new UserService();
    private final BookService bookService = new BookService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handlePreflight(exchange)) return;

        String path   = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod().toUpperCase();
        String sub    = path.replaceFirst("^/api/users", "");

        try {
            // Admin: list all users
            if ((sub.isEmpty() || sub.equals("/")) && "GET".equals(method)) {
                handleAllUsers(exchange);
                return;
            }

            // /api/users/{id}/...
            String[] parts = sub.split("/");
            // parts[0]="" parts[1]=userId parts[2]=action ...
            if (parts.length < 2) { sendNotFound(exchange, "User endpoint"); return; }

            String userId = parts[1];
            String action = (parts.length > 2) ? parts[2] : "";

            switch (action) {
                case "" -> {
                    if ("GET".equals(method))    handleGetUser(exchange, userId);
                    else if ("PUT".equals(method))    handleUpdateProfile(exchange, userId);
                    else if ("DELETE".equals(method)) handleDeleteUser(exchange, userId);
                    else sendMethodNotAllowed(exchange);
                }
                case "change-password" -> {
                    if ("POST".equals(method)) handleChangePassword(exchange, userId);
                    else sendMethodNotAllowed(exchange);
                }
                case "wishlist" -> {
                    String bookId = (parts.length > 3) ? parts[3] : null;
                    if ("GET".equals(method))    handleGetWishlist(exchange, userId);
                    else if ("POST".equals(method))   handleAddWishlist(exchange, userId);
                    else if ("DELETE".equals(method) && bookId != null)
                        handleRemoveWishlist(exchange, userId, bookId);
                    else sendMethodNotAllowed(exchange);
                }
                case "reviews" -> {
                    if ("GET".equals(method)) handleUserReviews(exchange, userId);
                    else sendMethodNotAllowed(exchange);
                }
                default -> sendNotFound(exchange, "User endpoint");
            }

        } catch (Exception e) {
            sendError(exchange, 500, "Internal error: " + e.getMessage());
        }
    }

    // ── GET /api/users (admin) ────────────────────────────────────────────────

    private void handleAllUsers(HttpExchange exchange) throws IOException {
        List<User> users = userService.getAllUsers();
        List<String> jsons = users.stream().map(User::toJson).collect(Collectors.toList());
        sendSuccess(exchange, toJsonArray(jsons));
    }

    // ── GET /api/users/{id} ────────────────────────────────────────────────────

    private void handleGetUser(HttpExchange exchange, String userId) throws IOException {
        User user = userService.findById(userId);
        if (user == null) { sendNotFound(exchange, "User"); return; }
        sendSuccess(exchange, user.toJson());
    }

    // ── PUT /api/users/{id} ────────────────────────────────────────────────────

    private void handleUpdateProfile(HttpExchange exchange, String userId) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        Map<String, Object> result = userService.updateProfile(userId, data);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendNotFound(exchange, "User");
        }
    }

    // ── DELETE /api/users/{id} (admin) ────────────────────────────────────────

    private void handleDeleteUser(HttpExchange exchange, String userId) throws IOException {
        Map<String, Object> result = userService.deleteUser(userId);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendNotFound(exchange, "User");
        }
    }

    // ── POST /api/users/{id}/change-password ──────────────────────────────────

    private void handleChangePassword(HttpExchange exchange, String userId) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String oldPwd = data.get("oldPassword");
        String newPwd = data.get("newPassword");
        Map<String, Object> result = userService.changePassword(userId, oldPwd, newPwd);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendError(exchange, 400, (String) result.get("message"));
        }
    }

    // ── GET /api/users/{id}/wishlist ──────────────────────────────────────────

    private void handleGetWishlist(HttpExchange exchange, String userId) throws IOException {
        List<WishlistItem> items  = userService.getWishlistByUser(userId);
        List<Book>         books  = bookService.getAllBooks();
        Map<String, Book>  bMap   = new HashMap<>();
        for (Book b : books) bMap.put(b.getId(), b);

        List<String> jsons = items.stream()
            .map(w -> w.toJson(bMap.get(w.getBookId())))
            .collect(Collectors.toList());

        sendSuccess(exchange, toJsonArray(jsons));
    }

    // ── POST /api/users/{id}/wishlist ─────────────────────────────────────────

    private void handleAddWishlist(HttpExchange exchange, String userId) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String bookId = data.get("bookId");
        Map<String, Object> result = userService.addToWishlist(userId, bookId);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendCreated(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendBadRequest(exchange, (String) result.get("message"));
        }
    }

    // ── DELETE /api/users/{id}/wishlist/{bookId} ──────────────────────────────

    private void handleRemoveWishlist(HttpExchange exchange, String userId,
                                      String bookId) throws IOException {
        Map<String, Object> result = userService.removeFromWishlist(userId, bookId);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendNotFound(exchange, "Wishlist item");
        }
    }

    // ── GET /api/users/{id}/reviews ───────────────────────────────────────────

    private void handleUserReviews(HttpExchange exchange, String userId) throws IOException {
        List<Review> reviews = userService.getReviewsByUser(userId);
        List<String> jsons   = reviews.stream().map(Review::toJson).collect(Collectors.toList());
        sendSuccess(exchange, toJsonArray(jsons));
    }
}
