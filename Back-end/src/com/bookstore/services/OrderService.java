package com.bookstore.services;

import com.bookstore.models.Order;
import com.bookstore.storage.FileStorage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * OrderService – Member 5 (Vishnu)
 *
 * Handles checkout, order placement, and order history.
 * All orders are stored in Back-end/data/orders.txt
 */
public class OrderService {

    private static final String FILE = "orders.txt";

    /** Tax rate applied to subtotal */
    public static final double TAX_RATE = 0.08;           // 8%

    /** Delivery charge thresholds */
    public static final double FREE_DELIVERY_THRESHOLD = 50.0;
    public static final double DELIVERY_CHARGE         = 4.99;

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Order> getAllOrders() {
        List<Order> orders = new ArrayList<>();
        for (String line : FileStorage.readLines(FILE)) {
            Order o = Order.fromFileLine(line);
            if (o != null) orders.add(o);
        }
        return orders;
    }

    public List<Order> getOrdersByUser(String userId) {
        return getAllOrders().stream()
            .filter(o -> o.getUserId().equals(userId))
            .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public Order findById(String id) {
        for (Order o : getAllOrders()) {
            if (o.getId().equals(id)) return o;
        }
        return null;
    }

    // ── Place Order ───────────────────────────────────────────────────────────

    /**
     * Place an order.
     *
     * @param userId        the user placing the order
     * @param items         cart items as "bookId:qty,bookId:qty"
     * @param subtotal      sum of book prices × quantities
     * @param discountCode  optional coupon code
     * @param discountAmt   computed discount amount
     * @param paymentMethod "COD" or "ONLINE"
     * @param address       delivery address
     * @param deliveryType  "STANDARD" | "EXPRESS"
     */
    public Map<String, Object> placeOrder(String userId, String items,
                                          double subtotal, String discountCode,
                                          double discountAmt, String paymentMethod,
                                          String address, String deliveryType) {
        Map<String, Object> result = new LinkedHashMap<>();

        // ── Validation ────────────────────────────────────────────────────────
        if (address == null || address.isBlank()) {
            result.put("success", false);
            result.put("message", "Delivery address is required");
            return result;
        }
        if (paymentMethod == null || paymentMethod.isBlank()) {
            result.put("success", false);
            result.put("message", "Payment method is required");
            return result;
        }

        // ── Calculations ──────────────────────────────────────────────────────
        double afterDiscount = subtotal - discountAmt;
        double tax           = afterDiscount * TAX_RATE;
        double delivery      = ("EXPRESS".equalsIgnoreCase(deliveryType)) ? 9.99 :
                               (afterDiscount >= FREE_DELIVERY_THRESHOLD  ? 0.0 : DELIVERY_CHARGE);
        double total         = afterDiscount + tax + delivery;

        // ── Create order ──────────────────────────────────────────────────────
        String id        = "ORD" + System.currentTimeMillis();
        String createdAt = LocalDateTime.now()
                           .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        Order order = new Order(
            id, userId, items,
            Math.round(total * 100.0) / 100.0,
            Math.round(tax  * 100.0) / 100.0,
            delivery,
            "CONFIRMED",
            paymentMethod,
            address,
            (discountCode == null) ? "" : discountCode,
            Math.round(discountAmt * 100.0) / 100.0,
            createdAt
        );

        FileStorage.appendLine(FILE, order.toFileLine());

        result.put("success",  true);
        result.put("message",  "Order placed successfully!");
        result.put("orderId",  id);
        result.put("order",    order.toJson());
        return result;
    }

    // ── Admin – Update Status ─────────────────────────────────────────────────

    public Map<String, Object> updateStatus(String orderId, String newStatus) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Order> orders = getAllOrders();
        boolean found = false;
        List<String> lines = new ArrayList<>();

        for (Order o : orders) {
            if (o.getId().equals(orderId)) {
                o.setStatus(newStatus);
                found = true;
            }
            lines.add(o.toFileLine());
        }

        if (!found) {
            result.put("success", false);
            result.put("message", "Order not found");
            return result;
        }

        FileStorage.writeLines(FILE, lines);
        result.put("success", true);
        result.put("message", "Order status updated to " + newStatus);
        return result;
    }

    // ── Admin – Sales Summary ─────────────────────────────────────────────────

    public Map<String, Object> getSalesSummary() {
        List<Order> orders = getAllOrders();
        double totalRevenue = orders.stream().mapToDouble(Order::getTotalPrice).sum();
        long   totalOrders  = orders.size();
        long   pending      = orders.stream().filter(o -> "PENDING".equals(o.getStatus())).count();
        long   confirmed    = orders.stream().filter(o -> "CONFIRMED".equals(o.getStatus())).count();
        long   delivered    = orders.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalOrders",   totalOrders);
        summary.put("totalRevenue",  Math.round(totalRevenue * 100.0) / 100.0);
        summary.put("pendingOrders", pending);
        summary.put("confirmed",     confirmed);
        summary.put("delivered",     delivered);
        return summary;
    }
}
