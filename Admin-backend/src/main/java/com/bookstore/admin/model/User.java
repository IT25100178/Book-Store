package com.bookstore.admin.model;

import java.util.UUID;

/**
 * User Model Class
 * OOP Concept: Encapsulation
 */
public class User {
    private String id;
    private String name;
    private String email;
    private String role;   // ADMIN or MEMBER
    private String status; // ACTIVE or BANNED

    public User() {
        this.id = UUID.randomUUID().toString();
    }

    public User(String name, String email, String role, String status) {
        this();
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
