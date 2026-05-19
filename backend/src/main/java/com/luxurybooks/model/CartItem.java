package com.luxurybooks.model;

/**
 * Model representing a single item in the shopping cart.
 * Demonstrates OOP: Encapsulation (private fields, public getters/setters).
 */
public class CartItem {
    private String bookId;
    private String title;
    private String author;
    private double price;
    private double originalPrice;
    private int quantity;
    private String image;
    private String category;
    private boolean savedForLater;

    public CartItem() {
        this.savedForLater = false;
    }

    public CartItem(String bookId, String title, String author, double price,
                    double originalPrice, int quantity, String image, String category) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.price = price;
        this.originalPrice = originalPrice;
        this.quantity = quantity;
        this.image = image;
        this.category = category;
        this.savedForLater = false;
    }

    /**
     * Calculates the line total for this cart item.
     * @return price * quantity
     */
    public double getLineTotal() {
        return this.price * this.quantity;
    }

    /**
     * Calculates total savings compared to original price.
     * @return (originalPrice - price) * quantity
     */
    public double getSavings() {
        return (this.originalPrice - this.price) * this.quantity;
    }

    // Encapsulation: Getters and Setters
    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isSavedForLater() { return savedForLater; }
    public void setSavedForLater(boolean savedForLater) { this.savedForLater = savedForLater; }
}
