package com.bookstore.admin.model;

public class Review {
    private String id;
    private String userId;
    private String bookId;
    private String book; // Book Title
    private int rating;
    private String comment;
    private String date;
    private String user; // User Name
    private String status;
    private String reply;

    public Review() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }
    public String getBook() { return book; }
    public void setBook(String book) { this.book = book; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
}
