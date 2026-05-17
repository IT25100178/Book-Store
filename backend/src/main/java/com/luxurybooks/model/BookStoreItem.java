package com.luxurybooks.model;

import java.util.ArrayList;
import java.util.List;

public class BookStoreItem extends BookInfo {
    private int id;
    private String category;
    private int stock;
    private String availability;
    private String image;
    private boolean featuredImage;
    private String authorId;
    private String publisher;
    private int pages;
    private List<Review> reviews = new ArrayList<>();

    public BookStoreItem() {
        super();
    }

    public BookStoreItem(int id, String isbn, String title, String description, double price, double originalPrice, 
                         double rating, int year, String author, String category, int stock, String availability, 
                         String image, boolean featuredImage, String authorId, String publisher, int pages) {
        super(isbn, title, description, price, originalPrice, rating, year, author);
        this.id = id;
        this.category = category;
        this.stock = stock;
        this.availability = availability;
        this.image = image;
        this.featuredImage = featuredImage;
        this.authorId = authorId;
        this.publisher = publisher;
        this.pages = pages;
    }

    @Override
    public double getDiscount() {
        if (getOriginalPrice() > 0) {
            double saved = getOriginalPrice() - getPrice();
            return Math.round((saved / getOriginalPrice()) * 100);
        }
        return 0;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public boolean isFeaturedImage() { return featuredImage; }
    public void setFeaturedImage(boolean featuredImage) { this.featuredImage = featuredImage; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }
}
