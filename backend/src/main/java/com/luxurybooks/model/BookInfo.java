package com.luxurybooks.model;

public abstract class BookInfo {
    private String isbn;
    private String title;
    private String description;
    private double price;
    private double originalPrice;
    private double rating;
    private int year;
    private String author;

    public BookInfo() {}

    public BookInfo(String isbn, String title, String description, double price, double originalPrice, double rating, int year, String author) {
        this.isbn = isbn;
        this.title = title;
        this.description = description;
        this.price = price;
        this.originalPrice = originalPrice;
        this.rating = rating;
        this.year = year;
        this.author = author;
    }

    public abstract double getDiscount();

    // Getters and Setters (Encapsulation)
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
}
