package com.bookstore.admin.service;

import com.bookstore.admin.model.Review;
import com.bookstore.admin.model.Book;
import org.springframework.stereotype.Service;
import java.io.*;
import java.util.*;

@Service
public class ReviewManager {
    private final BookManager bookManager;
    private static final String REVIEWS_FILE = "../Back-end/data/reviews.txt";

    public ReviewManager(BookManager bookManager) {
        this.bookManager = bookManager;
    }

    public List<Review> getAll() {
        List<Review> list = new ArrayList<>();
        Map<String, String> bookMap = new HashMap<>();
        try {
            for (Book b : bookManager.getAll()) {
                bookMap.put(b.getId(), b.getTitle());
            }
        } catch (Exception ignored) {}

        File file = new File(REVIEWS_FILE);
        if (!file.exists()) {
            return list;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] p = line.split("\\|", -1);
                if (p.length >= 7) {
                    Review r = new Review();
                    r.setId(p[0]);
                    r.setUserId(p[1]);
                    r.setBookId(p[2]);
                    r.setBook(bookMap.getOrDefault(p[2], "Unknown Book"));
                    try {
                        r.setRating(Integer.parseInt(p[3]));
                    } catch (Exception e) {
                        r.setRating(0);
                    }
                    r.setComment(p[4]);
                    r.setDate(p[5]);
                    r.setUser(p[6]);
                    r.setStatus(p.length >= 8 ? p[7] : "Approved");
                    r.setReply(p.length >= 9 ? p[8] : "");
                    list.add(r);
                }
            }
        } catch (Exception e) {
            System.err.println("Error reading reviews: " + e.getMessage());
        }
        return list;
    }

    public Review update(String id, Review updated) {
        List<Review> all = getAll();
        boolean found = false;
        for (Review r : all) {
            if (r.getId().equals(id)) {
                r.setStatus(updated.getStatus());
                r.setReply(updated.getReply());
                found = true;
                break;
            }
        }
        if (found) {
            saveAll(all);
            return updated;
        }
        return null;
    }

    public void delete(String id) {
        List<Review> all = getAll();
        all.removeIf(r -> r.getId().equals(id));
        saveAll(all);
    }

    private void saveAll(List<Review> list) {
        File file = new File(REVIEWS_FILE);
        if (file.getParentFile() != null) {
            file.getParentFile().mkdirs();
        }
        try (PrintWriter writer = new PrintWriter(new FileWriter(file))) {
            for (Review r : list) {
                String line = String.join("|",
                    r.getId() != null ? r.getId() : "",
                    r.getUserId() != null ? r.getUserId() : "",
                    r.getBookId() != null ? r.getBookId() : "",
                    String.valueOf(r.getRating()),
                    r.getComment() != null ? r.getComment() : "",
                    r.getDate() != null ? r.getDate() : "",
                    r.getUser() != null ? r.getUser() : "",
                    r.getStatus() != null ? r.getStatus() : "Approved",
                    r.getReply() != null ? r.getReply() : ""
                );
                writer.println(line);
            }
        } catch (Exception e) {
            System.err.println("Error saving reviews: " + e.getMessage());
        }
    }
}
