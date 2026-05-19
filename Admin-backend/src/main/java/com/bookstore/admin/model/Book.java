package com.bookstore.admin.model;

import java.util.UUID;

/**
 * Book Model Class
 * OOP Concept: Encapsulation - Private fields with public getters and setters.
 */
public class Book {
    private String id;
    private String title;
    private String author; // Keeping for compatibility or name display
    private String authorId;
    private String publisherId;
    private String isbn;
    private String category; // Keeping for compatibility or name display
    private String genreId;
    private double price;
    private int stockQuantity;
    private String description;
    private String coverImageUrl;

    public Book() {
        this.id = UUID.randomUUID().toString();
    }

    public Book(String title, String author, String isbn, String category, double price, int stockQuantity, String description, String coverImageUrl) {
        this();
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.description = description;
        this.coverImageUrl = coverImageUrl;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getPublisherId() { return publisherId; }
    public void setPublisherId(String publisherId) { this.publisherId = publisherId; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGenreId() { return genreId; }
    public void setGenreId(String genreId) { this.genreId = genreId; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
    
    public int getStock() { return stockQuantity; }
    public void setStock(int stock) { this.stockQuantity = stock; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    private double originalPrice;
    private double rating;
    private boolean isNew;
    private boolean isBestseller;
    private int pages;
    private int year;
    private String image;

    public double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public boolean isNew() { return isNew; }
    public void setNew(boolean isNew) { this.isNew = isNew; }

    public boolean isBestseller() { return isBestseller; }
    public void setBestseller(boolean isBestseller) { this.isBestseller = isBestseller; }

    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
