package com.luxurybooks.controller;

import com.luxurybooks.model.CartItem;
import com.luxurybooks.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Cart operations.
 * Provides endpoints for add, remove, update, discount, and save-for-later.
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        return ResponseEntity.ok(cartService.getCartItems());
    }

    @PostMapping("/add")
    public ResponseEntity<List<CartItem>> addToCart(@RequestBody CartItem item) {
        return ResponseEntity.ok(cartService.addToCart(item));
    }

    @DeleteMapping("/remove/{bookId}")
    public ResponseEntity<List<CartItem>> removeFromCart(@PathVariable String bookId) {
        return ResponseEntity.ok(cartService.removeFromCart(bookId));
    }

    @PutMapping("/update/{bookId}")
    public ResponseEntity<List<CartItem>> updateQuantity(
            @PathVariable String bookId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(bookId, quantity));
    }

    @PostMapping("/discount")
    public ResponseEntity<Map<String, Object>> applyDiscount(@RequestParam String code) {
        double discount = cartService.applyDiscountCode(code);
        Map<String, Object> response = new HashMap<>();
        response.put("discount", discount);
        response.put("valid", discount > 0);
        response.put("total", cartService.calculateTotal());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/save/{bookId}")
    public ResponseEntity<List<CartItem>> saveForLater(@PathVariable String bookId) {
        return ResponseEntity.ok(cartService.saveForLater(bookId));
    }

    @PostMapping("/unsave/{bookId}")
    public ResponseEntity<List<CartItem>> moveToCart(@PathVariable String bookId) {
        return ResponseEntity.ok(cartService.moveToCart(bookId));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<CartItem>> getSavedItems() {
        return ResponseEntity.ok(cartService.getSavedItems());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getCartSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("items", cartService.getCartItems());
        summary.put("count", cartService.getCartCount());
        summary.put("subtotal", cartService.calculateSubtotal());
        summary.put("total", cartService.calculateTotal());
        return ResponseEntity.ok(summary);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok("Cart cleared.");
    }
}
