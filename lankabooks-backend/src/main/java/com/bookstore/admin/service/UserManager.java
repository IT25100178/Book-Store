package com.bookstore.admin.service;

import com.bookstore.admin.model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * UserManager - Service class for User operations.
 * DSA Implementation:
 * - HashMap for O(1) lookups.
 * - Linear Search for searching by name.
 */
@Service
public class UserManager {
    private final JsonStorageUtil storage;
    private HashMap<String, User> userMap = new HashMap<>();

    public UserManager(JsonStorageUtil storage) {
        this.storage = storage;
    }

    @PostConstruct
    public void init() throws IOException {
        List<User> users = storage.readUsers();
        for (User user : users) {
            userMap.put(user.getId(), user);
        }
    }

    public List<User> getAll() {
        return new ArrayList<>(userMap.values());
    }

    public User toggleStatus(String id) throws IOException {
        User user = userMap.get(id);
        if (user != null) {
            String currentStatus = user.getStatus();
            user.setStatus("ACTIVE".equals(currentStatus) ? "BANNED" : "ACTIVE");
            save();
            return user;
        }
        return null;
    }

    /**
     * Linear Search by Name
     * DSA: O(n) average search.
     */
    public List<User> searchByName(String name) {
        List<User> results = new ArrayList<>();
        for (User user : userMap.values()) {
            if (user.getName().toLowerCase().contains(name.toLowerCase())) {
                results.add(user);
            }
        }
        return results;
    }

    private void save() throws IOException {
        storage.writeUsers(new ArrayList<>(userMap.values()));
    }
}
