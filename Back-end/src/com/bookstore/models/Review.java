package com.bookstore.models;

/**
 * OOP Model – Review
 * Represents a user's review of a book.
 * Data is serialized to / deserialized from reviews.txt
 */
public class Review {

    private String id;
    private String userId;
    private String bookId;
    private int    rating;
    private String comment;
    private String date;
    private String userName; // denormalized for display
    private String status = "Approved"; // default
    private String reply = "";

    // ── Constructors ─────────────────────────────────────────────────────────

    public Review() {}

    public Review(String id, String userId, String bookId, int rating,
                  String comment, String date, String userName) {
        this.id       = id;
        this.userId   = userId;
        this.bookId   = bookId;
        this.rating   = rating;
        this.comment  = comment;
        this.date     = date;
        this.userName = userName;
    }

    public Review(String id, String userId, String bookId, int rating,
                  String comment, String date, String userName, String status, String reply) {
        this(id, userId, bookId, rating, comment, date, userName);
        this.status = status != null ? status : "Approved";
        this.reply = reply != null ? reply : "";
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId()                   { return id; }
    public void   setId(String id)          { this.id = id; }

    public String getUserId()                   { return userId; }
    public void   setUserId(String userId)      { this.userId = userId; }

    public String getBookId()                   { return bookId; }
    public void   setBookId(String bookId)      { this.bookId = bookId; }

    public int    getRating()                   { return rating; }
    public void   setRating(int rating)         { this.rating = rating; }

    public String getComment()                      { return comment; }
    public void   setComment(String comment)        { this.comment = comment; }

    public String getDate()                 { return date; }
    public void   setDate(String date)      { this.date = date; }

    public String getUserName()                     { return userName; }
    public void   setUserName(String userName)      { this.userName = userName; }

    public String getStatus()                       { return status; }
    public void   setStatus(String status)          { this.status = status; }

    public String getReply()                        { return reply; }
    public void   setReply(String reply)            { this.reply = reply; }

    // ── Serialization ─────────────────────────────────────────────────────────

    /** Format: id|userId|bookId|rating|comment|date|userName|status|reply */
    public String toFileLine() {
        return String.join("|",
            safe(id), safe(userId), safe(bookId),
            String.valueOf(rating), safe(comment), safe(date), safe(userName),
            safe(status), safe(reply)
        );
    }

    public static Review fromFileLine(String line) {
        String[] p = line.split("\\|", -1);
        if (p.length < 7) return null;
        try {
            String status = p.length >= 8 ? p[7] : "Approved";
            String reply = p.length >= 9 ? p[8] : "";
            return new Review(p[0], p[1], p[2], Integer.parseInt(p[3]), p[4], p[5], p[6], status, reply);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public String toJson() {
        return "{"
            + "\"id\":\""        + esc(id)       + "\","
            + "\"userId\":\""    + esc(userId)   + "\","
            + "\"bookId\":\""    + esc(bookId)   + "\","
            + "\"rating\":"      + rating        + ","
            + "\"comment\":\""   + esc(comment)  + "\","
            + "\"date\":\""      + esc(date)     + "\","
            + "\"userName\":\""  + esc(userName) + "\","
            + "\"status\":\""    + esc(status)   + "\","
            + "\"reply\":\""     + esc(reply)    + "\""
            + "}";
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String safe(String s) { return s == null ? "" : s; }
    private String esc(String s)  {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    @Override
    public String toString() { return toJson(); }
}
