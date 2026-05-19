package com.luxurybooks.service;

import com.luxurybooks.model.CartItem;
import com.luxurybooks.model.DiscountCode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Implementation of CartService.
 * Demonstrates OOP: Polymorphism (implements CartService interface).
 * Demonstrates DSA: ArrayList, Linear Search, Iterator pattern.
 */
@Service
public class CartServiceImpl implements CartService {

    // DSA Concept: ArrayList — dynamic array for storing cart items
    private final List<CartItem> cartItems = new ArrayList<>();
    private final List<CartItem> savedForLater = new ArrayList<>();

    // DSA Concept: ArrayList — stores available discount codes
    private final List<DiscountCode> availableDiscounts = new ArrayList<>();

    private double appliedDiscount = 0.0;

    public CartServiceImpl() {
        // Initialize some sample discount codes
        availableDiscounts.add(new DiscountCode("LUXURY10", 10, 20.00));
        availableDiscounts.add(new DiscountCode("BOOKS20", 20, 50.00));
        availableDiscounts.add(new DiscountCode("WELCOME5", 5, 10.00));
        availableDiscounts.add(new DiscountCode("VIP30", 30, 100.00));
    }

    @Override
    public List<CartItem> addToCart(CartItem item) {
        // DSA Concept: Linear Search — check if the item already exists in cart
        for (CartItem existing : cartItems) {
            if (existing.getBookId().equals(item.getBookId())) {
                // Item found, increase quantity instead of adding duplicate
                existing.setQuantity(existing.getQuantity() + item.getQuantity());
                return new ArrayList<>(cartItems);
            }
        }
        // Item not found, add new entry to the ArrayList
        cartItems.add(item);
        return new ArrayList<>(cartItems);
    }

    @Override
    public List<CartItem> removeFromCart(String bookId) {
        // DSA Concept: Iterator-based removal — safe removal during traversal
        Iterator<CartItem> iterator = cartItems.iterator();
        while (iterator.hasNext()) {
            CartItem item = iterator.next();
            if (item.getBookId().equals(bookId)) {
                iterator.remove();
                break;
            }
        }
        return new ArrayList<>(cartItems);
    }

    @Override
    public List<CartItem> updateQuantity(String bookId, int quantity) {
        if (quantity <= 0) {
            return removeFromCart(bookId);
        }
        // DSA Concept: Linear Search to find the item
        for (CartItem item : cartItems) {
            if (item.getBookId().equals(bookId)) {
                item.setQuantity(quantity);
                break;
            }
        }
        return new ArrayList<>(cartItems);
    }

    @Override
    public double calculateSubtotal() {
        double subtotal = 0;
        // DSA Concept: Linear traversal to accumulate totals
        for (CartItem item : cartItems) {
            subtotal += item.getLineTotal();
        }
        return subtotal;
    }

    @Override
    public double calculateTotal() {
        double subtotal = calculateSubtotal();
        double tax = subtotal * 0.10;       // 10% tax
        double delivery = subtotal > 50 ? 0 : 5.0;  // Free delivery over $50
        return subtotal + tax + delivery - appliedDiscount;
    }

    @Override
    public double applyDiscountCode(String code) {
        // DSA Concept: Linear Search through available discount codes
        for (DiscountCode discount : availableDiscounts) {
            if (discount.getCode().equalsIgnoreCase(code) && discount.isActive()) {
                double subtotal = calculateSubtotal();
                this.appliedDiscount = discount.calculateDiscount(subtotal);
                return this.appliedDiscount;
            }
        }
        // Code not found or inactive
        this.appliedDiscount = 0.0;
        return 0.0;
    }

    @Override
    public List<CartItem> saveForLater(String bookId) {
        // DSA Concept: Linear Search + transfer between two ArrayLists
        Iterator<CartItem> iterator = cartItems.iterator();
        while (iterator.hasNext()) {
            CartItem item = iterator.next();
            if (item.getBookId().equals(bookId)) {
                item.setSavedForLater(true);
                savedForLater.add(item);
                iterator.remove();
                break;
            }
        }
        return new ArrayList<>(cartItems);
    }

    @Override
    public List<CartItem> moveToCart(String bookId) {
        // DSA Concept: Linear Search + transfer back to cart ArrayList
        Iterator<CartItem> iterator = savedForLater.iterator();
        while (iterator.hasNext()) {
            CartItem item = iterator.next();
            if (item.getBookId().equals(bookId)) {
                item.setSavedForLater(false);
                cartItems.add(item);
                iterator.remove();
                break;
            }
        }
        return new ArrayList<>(cartItems);
    }

    @Override
    public List<CartItem> getSavedItems() {
        return new ArrayList<>(savedForLater);
    }

    @Override
    public List<CartItem> getCartItems() {
        return new ArrayList<>(cartItems);
    }

    @Override
    public void clearCart() {
        cartItems.clear();
        appliedDiscount = 0.0;
    }

    @Override
    public int getCartCount() {
        int count = 0;
        for (CartItem item : cartItems) {
            count += item.getQuantity();
        }
        return count;
    }
}
