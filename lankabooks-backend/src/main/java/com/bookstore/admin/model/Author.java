package com.bookstore.admin.model;

import java.util.ArrayList;
import java.util.List;

public class Author {
    private String id;
    private String name;
    private String bio;
    private String nationality;
    private int birthYear;
    private String profileImageBase64;
    private List<String> bookIds = new ArrayList<>();

    public Author() {
    }

    public Author(String id, String name, String bio, String nationality, int birthYear, String profileImageBase64, List<String> bookIds) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.nationality = nationality;
        this.birthYear = birthYear;
        this.profileImageBase64 = profileImageBase64;
        this.bookIds = bookIds != null ? bookIds : new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public int getBirthYear() { return birthYear; }
    public void setBirthYear(int birthYear) { this.birthYear = birthYear; }
    public String getProfileImageBase64() { return profileImageBase64; }
    public void setProfileImageBase64(String profileImageBase64) { this.profileImageBase64 = profileImageBase64; }
    public List<String> getBookIds() { return bookIds; }
    public void setBookIds(List<String> bookIds) { this.bookIds = bookIds; }
}
