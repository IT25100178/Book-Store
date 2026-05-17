package com.bookstore.services;

import com.bookstore.models.User;
import com.bookstore.storage.FileStorage;

import java.time.LocalDate;
import java.util.*;

/**
 * AuthService – Member 1 (Athethan)
 *
 * Handles user registration, login, and forgot-password logic.
 * All users are stored in Back-end/data/users.txt
 */
public class AuthService {

    private static final String FILE = "users.txt";

    // ── Read all users ────────────────────────────────────────────────────────

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        for (String line : FileStorage.readLines(FILE)) {
            User u = User.fromFileLine(line);
            if (u != null) users.add(u);
        }
        return users;
    }

    // ── Find by email ─────────────────────────────────────────────────────────

    public User findByEmail(String email) {
        for (User u : getAllUsers()) {
            if (u.getEmail().equalsIgnoreCase(email)) return u;
        }
        return null;
    }

    public User findById(String id) {
        for (User u : getAllUsers()) {
            if (u.getId().equals(id)) return u;
        }
        return null;
    }

    // ── Register ──────────────────────────────────────────────────────────────

    /**
     * Validates and registers a new user.
     * Returns a result map: { success: true/false, message: "...", user: {...} }
     */
    public Map<String, Object> register(String name, String email,
                                        String password, String phone) {
        Map<String, Object> result = new LinkedHashMap<>();

        // ── Validation ───────────────────────────────────────────────────────
        if (name == null || name.trim().length() < 2) {
            result.put("success", false);
            result.put("message", "Name must be at least 2 characters");
            return result;
        }
        if (email == null || !email.contains("@") || !email.contains(".")) {
            result.put("success", false);
            result.put("message", "Please enter a valid email address");
            return result;
        }
        if (password == null || password.length() < 6) {
            result.put("success", false);
            result.put("message", "Password must be at least 6 characters");
            return result;
        }

        // Check duplicate email
        if (findByEmail(email) != null) {
            result.put("success", false);
            result.put("message", "Email is already registered");
            return result;
        }

        // ── Create user ───────────────────────────────────────────────────────
        String id      = "USR" + System.currentTimeMillis();
        String avatar  = "https://ui-avatars.com/api/?background=D4AF37&color=fff&name=" +
                         name.replace(" ", "+");
        String joined  = LocalDate.now().toString();
        String safePhone = (phone == null) ? "" : phone;

        User user = new User(id, name.trim(), email.toLowerCase().trim(),
                             password, safePhone, "", "USER", avatar, joined);

        FileStorage.appendLine(FILE, user.toFileLine());

        result.put("success", true);
        result.put("message", "Registration successful!");
        result.put("user", user.toJson());
        return result;
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> result = new LinkedHashMap<>();

        if (email == null || email.isBlank()) {
            result.put("success", false);
            result.put("message", "Email is required");
            return result;
        }
        if (password == null || password.isBlank()) {
            result.put("success", false);
            result.put("message", "Password is required");
            return result;
        }

        User user = findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) {
            result.put("success", false);
            result.put("message", "Invalid email or password");
            return result;
        }

        result.put("success", true);
        result.put("message", "Login successful!");
        result.put("user", user.toJson());
        return result;
    }

    // ── Forgot Password (reset) ───────────────────────────────────────────────

    /**
     * Resets the password if the email exists.
     * In a real system this would send an email; here it accepts a new password directly.
     */
    public Map<String, Object> resetPassword(String email, String newPassword) {
        Map<String, Object> result = new LinkedHashMap<>();

        if (email == null || email.isBlank()) {
            result.put("success", false);
            result.put("message", "Email is required");
            return result;
        }
        if (newPassword == null || newPassword.length() < 6) {
            result.put("success", false);
            result.put("message", "New password must be at least 6 characters");
            return result;
        }

        List<User> users    = getAllUsers();
        boolean    found    = false;
        List<String> lines  = new ArrayList<>();

        for (User u : users) {
            if (u.getEmail().equalsIgnoreCase(email)) {
                u.setPassword(newPassword);
                found = true;
            }
            lines.add(u.toFileLine());
        }

        if (!found) {
            result.put("success", false);
            result.put("message", "No account found with this email");
            return result;
        }

        FileStorage.writeLines(FILE, lines);
        result.put("success", true);
        result.put("message", "Password has been reset successfully");
        return result;
    }
}
