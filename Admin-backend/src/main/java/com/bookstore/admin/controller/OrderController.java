package com.bookstore.admin.controller;

import com.bookstore.admin.model.Order;
import com.bookstore.admin.service.OrderManager;
import com.bookstore.admin.service.ActivityLogManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderManager orderManager;
    private final ActivityLogManager logManager;

    public OrderController(OrderManager orderManager, ActivityLogManager logManager) {
        this.orderManager = orderManager;
        this.logManager = logManager;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@RequestParam(required = false) String sort) {
        if (sort != null) {
            return ResponseEntity.ok(orderManager.getSorted(sort));
        }
        return ResponseEntity.ok(orderManager.getAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestBody java.util.Map<String, String> payload) throws IOException {
        String status = payload.get("status");
        Order updatedOrder = orderManager.updateStatus(id, status);
        if (updatedOrder != null) {
            logManager.log("admin_uid", "ORDER_STATUS_UPDATED", id, "Order", "Changed order status to: " + status);
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }
}
