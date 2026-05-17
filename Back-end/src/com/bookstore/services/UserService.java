package com.bookstore.services;

import com.bookstore.models.User;
import com.bookstore.models.WishlistItem;
import com.bookstore.models.Review;
import com.bookstore.storage.FileStorage;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * UserService – Member 6 (Vishok)
 *
 * Handles user profile updates, wishlist, and review management.
 */
public class UserService {

    private static final String USERS_FILE    = "users.txt";
    private static final String WISHLIST_FILE = "wishlist.txt";
    private static final String REVIEWS_FILE  = "reviews.txt";

    // ── Profile ───────────────────────────────────────────────────────────────

    public User findById(String id) {
        for (String line : FileStorage.readLines(USERS_FILE)) {
            User u = User.fromFileLine(line);
            if (u != null && u.getId().equals(id)) return u;
        }
        return null;
    }

    private List<User> readAllUsers() {
        List<User> users = new ArrayList<>();
        for (String line : FileStorage.readLines(USERS_FILE)) {
            User u = User.fromFileLine(line);
            if (u != null) users.add(u);
        }
        return users;
    }

    private void writeAllUsers(List<User> users) {
        List<String> lines = users.stream()
            .map(User::toFileLine)
            .collect(Collectors.toList());
        FileStorage.writeLines(USERS_FILE, lines);
    }

    /**
     * Update editable profile fields (name, phone, address, avatar).
     */
    public Map<String, Object> updateProfile(String userId, Map<String, String> fields) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<User> users = readAllUsers();
        boolean found = false;

        for (User u : users) {
            if (u.getId().equals(userId)) {
                found = true;
                if (fields.containsKey("name"))    u.setName(fields.get("name"));
                if (fields.containsKey("phone"))   u.setPhone(fields.get("phone"));
                if (fields.containsKey("address")) u.setAddress(fields.get("address"));
                if (fields.containsKey("avatar"))  u.setAvatar(fields.get("avatar"));
                break;
            }
        }

        if (!found) {
            result.put("success", false);
            result.put("message", "User not found");
            return result;
        }

        writeAllUsers(users);
        result.put("success", true);
        result.put("message", "Profile updated successfully");
        return result;
    }

    /**
     * Change a user's password after verifying the current password.
     */
    public Map<String, Object> changePassword(String userId, String oldPassword,
                                              String newPassword) {
        Map<String, Object> result = new LinkedHashMap<>();

        if (newPassword == null || newPassword.length() < 6) {
            result.put("success", false);
            result.put("message", "New password must be at least 6 characters");
            return result;
        }

        List<User> users = readAllUsers();
        boolean found = false;

        for (User u : users) {
            if (u.getId().equals(userId)) {
                found = true;
                if (!u.getPassword().equals(oldPassword)) {
                    result.put("success", false);
                    result.put("message", "Current password is incorrect");
                    return result;
                }
                u.setPassword(newPassword);
                break;
            }
        }

        if (!found) {
            result.put("success", false);
            result.put("message", "User not found");
            return result;
        }

        writeAllUsers(users);
        result.put("success", true);
        result.put("message", "Password changed successfully");
        return result;
    }

    /** Get all users (for admin panel) */
    public List<User> getAllUsers() { return readAllUsers(); }

    public Map<String, Object> deleteUser(String userId) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<User> users = readAllUsers();
        int before = users.size();
        users.removeIf(u -> u.getId().equals(userId));
        if (users.size() == before) {
            result.put("success", false);
            result.put("message", "User not found");
            return result;
        }
        writeAllUsers(users);
        result.put("success", true);
        result.put("message", "User deleted");
        return result;
    }

    // ── Wishlist ──────────────────────────────────────────────────────────────

    private List<WishlistItem> readAllWishlist() {
        List<WishlistItem> items = new ArrayList<>();
        for (String line : FileStorage.readLines(WISHLIST_FILE)) {
            WishlistItem w = WishlistItem.fromFileLine(line);
            if (w != null) items.add(w);
        }
        return items;
    }

    private void writeAllWishlist(List<WishlistItem> items) {
        List<String> lines = items.stream()
            .map(WishlistItem::toFileLine)
            .collect(Collectors.toList());
        FileStorage.writeLines(WISHLIST_FILE, lines);
    }

    public List<WishlistItem> getWishlistByUser(String userId) {
        return readAllWishlist().stream()
            .filter(w -> w.getUserId().equals(userId))
            .collect(Collectors.toList());
    }

    public Map<String, Object> addToWishlist(String userId, String bookId) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<WishlistItem> all = readAllWishlist();

        boolean exists = all.stream()
            .anyMatch(w -> w.getUserId().equals(userId) && w.getBookId().equals(bookId));

        if (exists) {
            result.put("success", false);
            result.put("message", "Book already in wishlist");
            return result;
        }

        all.add(new WishlistItem(userId, bookId, LocalDate.now().toString()));
        writeAllWishlist(all);

        result.put("success", true);
        result.put("message", "Added to wishlist");
        return result;
    }

    public Map<String, Object> removeFromWishlist(String userId, String bookId) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<WishlistItem> all = readAllWishlist();
        int before = all.size();
        all.removeIf(w -> w.getUserId().equals(userId) && w.getBookId().equals(bookId));

        if (all.size() == before) {
            result.put("success", false);
            result.put("message", "Item not found in wishlist");
            return result;
        }

        writeAllWishlist(all);
        result.put("success", true);
        result.put("message", "Removed from wishlist");
        return result;
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    private List<Review> readAllReviews() {
        List<Review> reviews = new ArrayList<>();
        for (String line : FileStorage.readLines(REVIEWS_FILE)) {
            Review r = Review.fromFileLine(line);
            if (r != null) reviews.add(r);
        }
        return reviews;
    }

    public List<Review> getReviewsByBook(String bookId) {
        return readAllReviews().stream()
            .filter(r -> r.getBookId().equals(bookId))
            .collect(Collectors.toList());
    }

    public List<Review> getReviewsByUser(String userId) {
        return readAllReviews().stream()
            .filter(r -> r.getUserId().equals(userId))
            .collect(Collectors.toList());
    }

    public Map<String, Object> addReview(String userId, String bookId,
                                         int rating, String comment, String userName) {
        Map<String, Object> result = new LinkedHashMap<>();

        if (rating < 1 || rating > 5) {
            result.put("success", false);
            result.put("message", "Rating must be between 1 and 5");
            return result;
        }
        if (comment == null || comment.isBlank()) {
            result.put("success", false);
            result.put("message", "Review comment cannot be empty");
            return result;
        }

        String id   = "REV" + System.currentTimeMillis();
        String date = LocalDate.now().toString();
        Review rev  = new Review(id, userId, bookId, rating, comment, date, userName);

        FileStorage.appendLine(REVIEWS_FILE, rev.toFileLine());

        result.put("success", true);
        result.put("message", "Review added successfully");
        result.put("review", rev.toJson());
        return result;
    }
}
