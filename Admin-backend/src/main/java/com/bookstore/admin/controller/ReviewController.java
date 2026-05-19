package com.bookstore.admin.controller;

import com.bookstore.admin.model.Review;
import com.bookstore.admin.service.ReviewManager;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewManager manager;

    public ReviewController(ReviewManager manager) {
        this.manager = manager;
    }

    @GetMapping
    public List<Review> getAll() {
        return manager.getAll();
    }

    @PutMapping("/{id}")
    public Review update(@PathVariable String id, @RequestBody Review review) {
        return manager.update(id, review);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        manager.delete(id);
    }
}
