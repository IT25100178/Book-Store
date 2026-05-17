package com.bookstore.models;

/**
 * OOP Model – WishlistItem
 * Represents a book saved to a user's wishlist.
 * Data is serialized to / deserialized from wishlist.txt
 */
public class WishlistItem {

    private String userId;
    private String bookId;
    private String addedAt;

    // ── Constructors ─────────────────────────────────────────────────────────

    public WishlistItem() {}

    public WishlistItem(String userId, String bookId, String addedAt) {
        this.userId  = userId;
        this.bookId  = bookId;
        this.addedAt = addedAt;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getUserId()                    { return userId; }
    public void   setUserId(String userId)       { this.userId = userId; }

    public String getBookId()                    { return bookId; }
    public void   setBookId(String bookId)       { this.bookId = bookId; }

    public String getAddedAt()                   { return addedAt; }
    public void   setAddedAt(String addedAt)     { this.addedAt = addedAt; }

    // ── Serialization ─────────────────────────────────────────────────────────

    /** Format: userId|bookId|addedAt */
    public String toFileLine() {
        return safe(userId) + "|" + safe(bookId) + "|" + safe(addedAt);
    }

    public static WishlistItem fromFileLine(String line) {
        String[] p = line.split("\\|", -1);
        if (p.length < 3) return null;
        return new WishlistItem(p[0], p[1], p[2]);
    }

    public String toJson(Book book) {
        String bookJson = book != null ? book.toJson() : "null";
        return "{"
            + "\"userId\":\""  + safe(userId)  + "\","
            + "\"bookId\":\""  + safe(bookId)  + "\","
            + "\"addedAt\":\"" + safe(addedAt) + "\","
            + "\"book\":"      + bookJson
            + "}";
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String safe(String s) { return s == null ? "" : s; }

    @Override
    public String toString() {
        return "{\"userId\":\"" + userId + "\",\"bookId\":\"" + bookId + "\",\"addedAt\":\"" + addedAt + "\"}";
    }
}
