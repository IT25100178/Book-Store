package com.bookstore.models;

/**
 * OOP Model – CartItem
 * Represents a single item in a user's cart.
 * Data is serialized to / deserialized from cart.txt
 */
public class CartItem {

    private String userId;
    private String bookId;
    private int    quantity;

    // ── Constructors ─────────────────────────────────────────────────────────

    public CartItem() {}

    public CartItem(String userId, String bookId, int quantity) {
        this.userId   = userId;
        this.bookId   = bookId;
        this.quantity = quantity;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getUserId()                    { return userId; }
    public void   setUserId(String userId)       { this.userId = userId; }

    public String getBookId()                    { return bookId; }
    public void   setBookId(String bookId)       { this.bookId = bookId; }

    public int    getQuantity()                  { return quantity; }
    public void   setQuantity(int quantity)      { this.quantity = quantity; }

    // ── Serialization ─────────────────────────────────────────────────────────

    /** Format: userId|bookId|quantity */
    public String toFileLine() {
        return userId + "|" + bookId + "|" + quantity;
    }

    public static CartItem fromFileLine(String line) {
        String[] p = line.split("\\|", -1);
        if (p.length < 3) return null;
        try {
            return new CartItem(p[0], p[1], Integer.parseInt(p[2]));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public String toJson(Book book) {
        String bookJson = book != null ? book.toJson() : "null";
        return "{"
            + "\"userId\":\""   + safe(userId)           + "\","
            + "\"bookId\":\""   + safe(bookId)           + "\","
            + "\"quantity\":"   + quantity               + ","
            + "\"book\":"       + bookJson
            + "}";
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String safe(String s) { return s == null ? "" : s; }

    @Override
    public String toString() {
        return "{\"userId\":\"" + userId + "\",\"bookId\":\"" + bookId + "\",\"quantity\":" + quantity + "}";
    }
}
