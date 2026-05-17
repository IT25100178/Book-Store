package com.bookstore.handlers;

import com.bookstore.models.Order;
import com.bookstore.server.BaseHandler;
import com.bookstore.services.CartService;
import com.bookstore.services.BookService;
import com.bookstore.services.OrderService;
import com.bookstore.storage.FileStorage;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * OrderHandler – Member 5 (Vishnu)
 *
 * Routes:
 *   POST /api/orders/place          → place a new order
 *   GET  /api/orders/{userId}       → order history for a user
 *   GET  /api/orders/detail/{id}    → single order
 *   PUT  /api/orders/{id}/status    → admin: update order status
 *   GET  /api/orders/summary        → admin: sales summary
 *   GET  /api/orders/all            → admin: all orders
 */
public class OrderHandler extends BaseHandler {

    private final OrderService orderService = new OrderService();
    private final CartService  cartService  = new CartService();
    private final BookService  bookService  = new BookService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handlePreflight(exchange)) return;

        String path   = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod().toUpperCase();
        String sub    = path.replaceFirst("^/api/orders", "");

        try {
            if (sub.equals("/place") && "POST".equals(method)) {
                handlePlaceOrder(exchange);

            } else if (sub.equals("/summary") && "GET".equals(method)) {
                handleSalesSummary(exchange);

            } else if (sub.equals("/all") && "GET".equals(method)) {
                handleAllOrders(exchange);

            } else if (sub.startsWith("/detail/") && "GET".equals(method)) {
                String orderId = sub.substring("/detail/".length());
                handleGetOrder(exchange, orderId);

            } else if (sub.matches("/[^/]+/status") && "PUT".equals(method)) {
                String orderId = sub.split("/")[1];
                handleUpdateStatus(exchange, orderId);

            } else if (sub.matches("/[^/]+") && "GET".equals(method)) {
                String userId = sub.substring(1);
                handleUserOrders(exchange, userId);

            } else {
                sendNotFound(exchange, "Order endpoint");
            }
        } catch (Exception e) {
            sendError(exchange, 500, "Internal error: " + e.getMessage());
        }
    }

    // ── POST /api/orders/place ─────────────────────────────────────────────────

    private void handlePlaceOrder(HttpExchange exchange) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String userId        = data.get("userId");
        String items         = data.get("items");        // "bookId:qty,bookId:qty"
        String paymentMethod = data.getOrDefault("paymentMethod", "COD");
        String address       = data.get("address");
        String deliveryType  = data.getOrDefault("deliveryType", "STANDARD");
        String discountCode  = data.getOrDefault("discountCode", "");
        double subtotal      = parseDoubleOr(data.get("subtotal"), 0.0);
        double discountAmt   = parseDoubleOr(data.get("discountAmount"), 0.0);

        Map<String, Object> result = orderService.placeOrder(
            userId, items, subtotal, discountCode, discountAmt,
            paymentMethod, address, deliveryType
        );

        if (Boolean.TRUE.equals(result.get("success"))) {
            // Clear cart after placing order
            if (userId != null) cartService.clearCart(userId);

            // Decrease stock for each ordered item
            if (items != null && !items.isBlank()) {
                for (String entry : items.split(",")) {
                    String[] parts = entry.split(":");
                    if (parts.length == 2) {
                        try {
                            bookService.decreaseStock(parts[0].trim(),
                                                      Integer.parseInt(parts[1].trim()));
                        } catch (NumberFormatException ignored) {}
                    }
                }
            }

            sendCreated(exchange, "{"
                + "\"success\":true,"
                + "\"message\":\"" + result.get("message") + "\","
                + "\"orderId\":\"" + result.get("orderId") + "\","
                + "\"order\":"    + result.get("order")
                + "}");
        } else {
            sendBadRequest(exchange, (String) result.get("message"));
        }
    }

    // ── GET /api/orders/{userId} ───────────────────────────────────────────────

    private void handleUserOrders(HttpExchange exchange, String userId) throws IOException {
        List<Order> orders = orderService.getOrdersByUser(userId);
        List<String> jsons = orders.stream().map(Order::toJson).collect(Collectors.toList());
        sendSuccess(exchange, toJsonArray(jsons));
    }

    // ── GET /api/orders/detail/{id} ────────────────────────────────────────────

    private void handleGetOrder(HttpExchange exchange, String orderId) throws IOException {
        Order order = orderService.findById(orderId);
        if (order == null) { sendNotFound(exchange, "Order"); return; }
        sendSuccess(exchange, order.toJson());
    }

    // ── PUT /api/orders/{id}/status ────────────────────────────────────────────

    private void handleUpdateStatus(HttpExchange exchange, String orderId) throws IOException {
        Map<String, String> data = FileStorage.parseJsonBody(readBody(exchange));
        String status = data.get("status");
        Map<String, Object> result = orderService.updateStatus(orderId, status);
        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\"" + result.get("message") + "\"}");
        } else {
            sendNotFound(exchange, "Order");
        }
    }

    // ── GET /api/orders/summary (admin) ───────────────────────────────────────

    private void handleSalesSummary(HttpExchange exchange) throws IOException {
        Map<String, Object> s = orderService.getSalesSummary();
        sendSuccess(exchange, "{"
            + "\"totalOrders\":"   + s.get("totalOrders")   + ","
            + "\"totalRevenue\":"  + s.get("totalRevenue")  + ","
            + "\"pendingOrders\":" + s.get("pendingOrders") + ","
            + "\"confirmed\":"     + s.get("confirmed")     + ","
            + "\"delivered\":"     + s.get("delivered")
            + "}");
    }

    // ── GET /api/orders/all (admin) ────────────────────────────────────────────

    private void handleAllOrders(HttpExchange exchange) throws IOException {
        List<Order> orders = orderService.getAllOrders();
        List<String> jsons = orders.stream().map(Order::toJson).collect(Collectors.toList());
        sendSuccess(exchange, toJsonArray(jsons));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private double parseDoubleOr(String s, double def) {
        try { return s != null ? Double.parseDouble(s.trim()) : def; }
        catch (NumberFormatException e) { return def; }
    }
}
