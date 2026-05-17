package com.luxurybooks.model;

public class Review {
    private String id;
    private String user;
    private int rating;
    private String comment;
    private String date;
    private int helpfulVotes;

    public Review() {}

    public Review(String id, String user, int rating, String comment, String date, int helpfulVotes) {
        this.id = id;
        this.user = user;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
        this.helpfulVotes = helpfulVotes;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getHelpfulVotes() { return helpfulVotes; }
    public void setHelpfulVotes(int helpfulVotes) { this.helpfulVotes = helpfulVotes; }
}
