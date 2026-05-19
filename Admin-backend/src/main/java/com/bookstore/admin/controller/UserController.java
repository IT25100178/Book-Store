package com.bookstore.admin.controller;

import com.bookstore.admin.model.User;
import com.bookstore.admin.service.UserManager;
import com.bookstore.admin.service.OrderManager;
import com.bookstore.admin.service.BookManager;
import com.bookstore.admin.service.ActivityLogManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserManager userManager;
    private final OrderManager orderManager;
    private final BookManager bookManager;
    private final ActivityLogManager logManager;

    public UserController(UserManager userManager, OrderManager orderManager, BookManager bookManager, ActivityLogManager logManager) {
        this.userManager = userManager;
        this.orderManager = orderManager;
        this.bookManager = bookManager;
        this.logManager = logManager;
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userManager.getAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<User> toggleStatus(@PathVariable String id) {
        try {
            User updatedUser = userManager.toggleStatus(id);
            if (updatedUser != null) {
                logManager.log("admin_uid", "USER_STATUS_TOGGLED", id, "User", "Changed status to: " + updatedUser.getStatus());
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(userManager.searchByName(name));
    }

    /** GET /api/admin/users/{id}/ordered-books — get all books ordered by this user */
    @GetMapping("/{id}/ordered-books")
    public ResponseEntity<List<com.bookstore.admin.model.Book>> getOrderedBooks(@PathVariable String id) {
        List<com.bookstore.admin.model.Order> userOrders = orderManager.getOrdersByUserId(id);
        List<com.bookstore.admin.model.Book> orderedBooks = new java.util.ArrayList<>();
        java.util.Set<String> bookIdSet = new java.util.HashSet<>();

        for (com.bookstore.admin.model.Order order : userOrders) {
            if (order.getBookIds() != null) {
                bookIdSet.addAll(order.getBookIds());
            }
        }

        for (String bookId : bookIdSet) {
            com.bookstore.admin.model.Book b = bookManager.getById(bookId);
            if (b != null) {
                orderedBooks.add(b);
            }
        }

        return ResponseEntity.ok(orderedBooks);
    }
}
