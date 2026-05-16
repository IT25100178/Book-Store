package com.bookstore.admin.model;

import java.util.UUID;

/**
 * Publisher Model
 * OOP Concept: Encapsulation - private fields with public getters/setters.
 */
public class Publisher {
    private String id;
    private String name;
    private String country;
    private String website;
    private int founded;
    private int bookCount; // number of books catalogued under this publisher
    private java.util.List<String> bookIds = new java.util.ArrayList<>();

    public Publisher() {
        this.id = UUID.randomUUID().toString();
    }

    public Publisher(String name, String country, String website, int founded) {
        this();
        this.name = name;
        this.country = country;
        this.website = website;
        this.founded = founded;
        this.bookCount = 0;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public int getFounded() { return founded; }
    public void setFounded(int founded) { this.founded = founded; }

    public int getBookCount() { return bookCount; }
    public void setBookCount(int bookCount) { this.bookCount = bookCount; }

    public java.util.List<String> getBookIds() { return bookIds; }
    public void setBookIds(java.util.List<String> bookIds) { this.bookIds = bookIds; }
}
