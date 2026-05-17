package com.luxurybooks.model;

import java.util.ArrayList;
import java.util.List;

public class Author {
    private String id;
    private String name;
    private String photo;
    private String bio;
    private String birthDate;
    private String deathDate;
    private String nationality;
    private List<String> notableWorks = new ArrayList<>();

    public Author() {}

    public Author(String id, String name, String photo, String bio, String birthDate, String deathDate, String nationality, List<String> notableWorks) {
        this.id = id;
        this.name = name;
        this.photo = photo;
        this.bio = bio;
        this.birthDate = birthDate;
        this.deathDate = deathDate;
        this.nationality = nationality;
        this.notableWorks = notableWorks;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }

    public String getDeathDate() { return deathDate; }
    public void setDeathDate(String deathDate) { this.deathDate = deathDate; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public List<String> getNotableWorks() { return notableWorks; }
    public void setNotableWorks(List<String> notableWorks) { this.notableWorks = notableWorks; }
}
