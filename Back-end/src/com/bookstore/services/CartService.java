package com.bookstore.services;

import com.bookstore.models.CartItem;
import com.bookstore.models.Book;
import com.bookstore.storage.FileStorage;

import java.util.*;
import java.util.stream.Collectors;

/**
 * CartService – Member 4 (Lojeni)
 *
 * Manages shopping cart state per user.
 * All cart entries are stored in Back-end/data/cart.txt
 */
public class CartService {

    private static final String FILE = "cart.txt";

    // ── Read ──────────────────────────────────────────────────────────────────

    private List<CartItem> readAll() {
        List<CartItem> items = new ArrayList<>();
        for (String line : FileStorage.readLines(FILE)) {
            CartItem c = CartItem.fromFileLine(line);
            if (c != null) items.add(c);
        }
        return items;
    }

    private void writeAll(List<CartItem> items) {
        List<String> lines = items.stream()
            .map(CartItem::toFileLine)
            .collect(Collectors.toList());
        FileStorage.writeLines(FILE, lines);
    }

    /** Get all cart items for a specific user */
    public List<CartItem> getCartByUser(String userId) {
        return readAll().stream()
            .filter(c -> c.getUserId().equals(userId))
            .collect(Collectors.toList());
    }

    // ── Add / Update ──────────────────────────────────────────────────────────

    /**
     * Add a book to cart, or increment quantity if already present.
     */
    public Map<String, Object> addToCart(String userId, String bookId, int quantity) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<CartItem> all = readAll();
        boolean found = false;

        for (CartItem c : all) {
            if (c.getUserId().equals(userId) && c.getBookId().equals(bookId)) {
                c.setQuantity(c.getQuantity() + quantity);
                found = true;
                break;
            }
        }

        if (!found) {
            all.add(new CartItem(userId, bookId, quantity));
        }

        writeAll(all);
        result.put("success", true);
        result.put("message", "Item added to cart");
        return result;
    }

    /**
     * Set the exact quantity for a cart item.
     * If quantity <= 0, the item is removed.
     */
    public Map<String, Object> updateQuantity(String userId, String bookId, int quantity) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<CartItem> all = readAll();

        if (quantity <= 0) {
            return removeFromCart(userId, bookId);
        }

        boolean found = false;
        for (CartItem c : all) {
            if (c.getUserId().equals(userId) && c.getBookId().equals(bookId)) {
                c.setQuantity(quantity);
                found = true;
                break;
            }
        }

        if (!found) {
            result.put("success", false);
            result.put("message", "Item not found in cart");
            return result;
        }

        writeAll(all);
        result.put("success", true);
        result.put("message", "Quantity updated");
        return result;
    }

    // ── Remove ────────────────────────────────────────────────────────────────

    public Map<String, Object> removeFromCart(String userId, String bookId) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<CartItem> all = readAll();
        int before = all.size();
        all.removeIf(c -> c.getUserId().equals(userId) && c.getBookId().equals(bookId));

        if (all.size() == before) {
            result.put("success", false);
            result.put("message", "Item not found in cart");
            return result;
        }

        writeAll(all);
        result.put("success", true);
        result.put("message", "Item removed from cart");
        return result;
    }

    /** Remove all items for a user (called after order placement) */
    public void clearCart(String userId) {
        List<CartItem> all = readAll();
        all.removeIf(c -> c.getUserId().equals(userId));
        writeAll(all);
    }

    // ── Discount Codes ────────────────────────────────────────────────────────

    /**
     * Validate a discount code and return the discount percentage (0-100).
     * Hard-coded demo codes stored here for the OOP module demo.
     */
    public Map<String, Object> applyDiscount(String code) {
        Map<String, Object> result = new LinkedHashMap<>();
        Map<String, Integer> validCodes = Map.of(
            "LUXBOOKS10", 10,
            "OOP2024",    15,
            "STUDENT20",  20,
            "WELCOME5",    5
        );

        if (code == null || code.isBlank()) {
            result.put("success", false);
            result.put("message", "Please enter a discount code");
            return result;
        }

        Integer discount = validCodes.get(code.toUpperCase());
        if (discount == null) {
            result.put("success", false);
            result.put("message", "Invalid discount code");
            return result;
        }

        result.put("success", true);
        result.put("discountPercent", discount);
        result.put("message", discount + "% discount applied!");
        return result;
    }

    // ── Summary ───────────────────────────────────────────────────────────────

    /**
     * Calculate cart total for a user given a list of books for price lookup.
     */
    public double calculateTotal(String userId, List<Book> allBooks) {
        Map<String, Book> bookMap = new HashMap<>();
        for (Book b : allBooks) bookMap.put(b.getId(), b);

        double total = 0;
        for (CartItem c : getCartByUser(userId)) {
            Book b = bookMap.get(c.getBookId());
            if (b != null) total += b.getPrice() * c.getQuantity();
        }
        return total;
    }
}
