package com.bookstore.admin.controller;

import com.bookstore.admin.model.User;
import com.bookstore.admin.service.UserManager;
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
    private final ActivityLogManager logManager;

    public UserController(UserManager userManager, ActivityLogManager logManager) {
        this.userManager = userManager;
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
}
