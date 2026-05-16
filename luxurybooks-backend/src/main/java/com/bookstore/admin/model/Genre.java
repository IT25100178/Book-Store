package com.bookstore.admin.model;

import java.util.ArrayList;
import java.util.List;

public class Genre {
    private String id;
    private String name;
    private String description;
    private List<String> bookIds = new ArrayList<>();
    private String colorTag;

    public Genre() {
    }

    public Genre(String id, String name, String description, List<String> bookIds, String colorTag) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.bookIds = bookIds != null ? bookIds : new ArrayList<>();
        this.colorTag = colorTag;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getBookIds() { return bookIds; }
    public void setBookIds(List<String> bookIds) { this.bookIds = bookIds; }
    public String getColorTag() { return colorTag; }
    public void setColorTag(String colorTag) { this.colorTag = colorTag; }
}
