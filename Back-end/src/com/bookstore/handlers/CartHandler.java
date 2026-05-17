package com.bookstore.handlers;

import com.bookstore.models.Book;
import com.bookstore.models.CartItem;
import com.bookstore.server.BaseHandler;
import com.bookstore.services.BookService;
import com.bookstore.services.CartService;
import com.bookstore.storage.FileStorage;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * CartHandler – Member 4 (Lojeni)
 *
 * Routes:
 *   GET    /api/cart/{userId}          → get cart items (with book data)
 *   POST   /api/cart/add               → add item to cart
 *   PUT    /api/cart/update            → update quantity
 *   DELETE /api/cart/remove            → remove item
 *   DELETE /api/cart/{userId}/clear    → clear entire cart
 *   POST   /api/cart/discount          → validate discount code
 */
public class CartHandler extends BaseHandler {

    private final CartService cartService = new CartService();
    private final BookService bookService = new BookService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handlePreflight(exchange)) return;

        String path   = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod().toUpperCase();

        // Strip /api/cart prefix → sub e.g. "/userId", "/add", "/update"
        String sub = path.replaceFirst("^/api/cart", "");

        try {
            if (sub.equals("/add") && "POST".equals(method)) {
                handleAdd(exchange);

            } else if (sub.equals("/update") && "PUT".equals(method)) {
                handleUpdate(exchange);

            } else if (sub.equals("/remove") && "DELETE".equals(method)) {
                handleRemove(exchange);

            } else if (sub.equals("/discount") && "POST".equals(method)) {
                handleDiscount(exchange);

            } else if (sub.matches("/[^/]+/clear") && "DELETE".equals(method)) {
                String userId = sub.split("/")[1];
                cartService.clearCart(userId);
                sendSuccess(exchange, "{\"success\":true,\"message\":\"Cart cleared\"}");

            } else if (sub.matches("/[^/]+") && "GET".equals(method)) {
                String userId = sub.substring(1);
                handleGetCart(exchange, userId);

            } else {
                sendNotFound(exchange, "Cart endpoint");
            }
        } catch (Exception e) {
            sendError(exchange, 500, "Internal error: " + e.getMessage());
        }
    }

    // ── GET /api/cart/{userId} ─────────────────────────────────────────────────

    private void handleGetCart(HttpExchange exchange, String userId) throws IOException {
        List<CartItem>  items   = cartService.getCartByUser(userId);
        List<Book>      books   = bookService.getAllBooks();
        Map<String, Book> bookMap = new HashMap<>();
        for (Book b : books) bookMap.put(b.getId(), b);

        List<String> jsons = items.stream()
            .map(c -> c.toJson(bookMap.get(c.getBookId())))
            .collect(Collectors.toList());

        double total = cartService.calculateTotal(userId, books);

        String json = "{"
            + "\"items\":"   + toJsonArray(jsons) + ","
            + "\"total\":"   + Math.round(total * 100.0) / 100.0
            + "}";

        sendSuccess(exchange, json);
    }

    // ── POST /api/cart/add ────────────────────────────────────────────────────

    private void handleAdd(HttpExchange exchange) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String userId  = data.get("userId");
        String bookId  = data.get("bookId");
        int    qty     = parseIntOr(data.get("quantity"), 1);

        if (userId == null || bookId == null) {
            sendBadRequest(exchange, "userId and bookId are required");
            return;
        }

        Map<String, Object> result = cartService.addToCart(userId, bookId, qty);
        sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
    }

    // ── PUT /api/cart/update ──────────────────────────────────────────────────

    private void handleUpdate(HttpExchange exchange) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String userId = data.get("userId");
        String bookId = data.get("bookId");
        int    qty    = parseIntOr(data.get("quantity"), 1);

        Map<String, Object> result = cartService.updateQuantity(userId, bookId, qty);
        boolean ok = Boolean.TRUE.equals(result.get("success"));
        if (ok) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendNotFound(exchange, "Cart item");
        }
    }

    // ── DELETE /api/cart/remove ───────────────────────────────────────────────

    private void handleRemove(HttpExchange exchange) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String userId = data.get("userId");
        String bookId = data.get("bookId");

        Map<String, Object> result = cartService.removeFromCart(userId, bookId);
        boolean ok = Boolean.TRUE.equals(result.get("success"));
        if (ok) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendNotFound(exchange, "Cart item");
        }
    }

    // ── POST /api/cart/discount ───────────────────────────────────────────────

    private void handleDiscount(HttpExchange exchange) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String code = data.get("code");
        Map<String, Object> result = cartService.applyDiscount(code);

        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{"
                + "\"success\":true,"
                + "\"discountPercent\":" + result.get("discountPercent") + ","
                + "\"message\":\"" + result.get("message") + "\""
                + "}");
        } else {
            sendBadRequest(exchange, (String) result.get("message"));
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private int parseIntOr(String s, int def) {
        try { return s != null ? Integer.parseInt(s.trim()) : def; }
        catch (NumberFormatException e) { return def; }
    }
}
