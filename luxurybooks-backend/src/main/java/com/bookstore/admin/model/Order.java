package com.bookstore.admin.model;

import java.util.List;
import java.util.UUID;

/**
 * Order Model Class
 * OOP Concept: Encapsulation
 */
public class Order {
    private String id;
    private String userId;
    private List<String> bookIds;
    private double totalPrice;
    private String status; // PENDING, SHIPPED, DELIVERED, CANCELLED
    private String orderDate;

    public Order() {
        this.id = UUID.randomUUID().toString();
    }

    public Order(String userId, List<String> bookIds, double totalPrice, String status, String orderDate) {
        this();
        this.userId = userId;
        this.bookIds = bookIds;
        this.totalPrice = totalPrice;
        this.status = status;
        this.orderDate = orderDate;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<String> getBookIds() { return bookIds; }
    public void setBookIds(List<String> bookIds) { this.bookIds = bookIds; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOrderDate() { return orderDate; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }
}
