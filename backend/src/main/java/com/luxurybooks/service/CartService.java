package com.luxurybooks.service;

import com.luxurybooks.model.CartItem;
import com.luxurybooks.model.DiscountCode;
import java.util.List;

/**
 * Interface for Cart operations.
 * Demonstrates OOP: Abstraction — hides complex cart logic behind a clean interface.
 */
public interface CartService {

    /**
     * Adds an item to the cart. If the item already exists, increases quantity.
     * DSA Concept: Linear Search (find existing item by bookId).
     * @param item The CartItem to add.
     * @return Updated list of cart items.
     */
    List<CartItem> addToCart(CartItem item);

    /**
     * Removes an item from the cart by bookId.
     * DSA Concept: Linear Search to locate, then ArrayList remove.
     * @param bookId The ID of the book to remove.
     * @return Updated list of cart items.
     */
    List<CartItem> removeFromCart(String bookId);

    /**
     * Updates the quantity of a specific cart item.
     * @param bookId The ID of the book.
     * @param quantity The new quantity (if <= 0, item is removed).
     * @return Updated list of cart items.
     */
    List<CartItem> updateQuantity(String bookId, int quantity);

    /**
     * Calculates the subtotal of all active cart items.
     * @return Subtotal amount.
     */
    double calculateSubtotal();

    /**
     * Calculates the total including tax and delivery.
     * @return Total order amount.
     */
    double calculateTotal();

    /**
     * Applies a discount code and returns the discount amount.
     * DSA Concept: Linear Search through available discount codes.
     * @param code The discount code string.
     * @return Discount amount, or 0 if code is invalid.
     */
    double applyDiscountCode(String code);

    /**
     * Moves an item to the "Save for Later" list.
     * @param bookId The ID of the book to save.
     * @return Updated list of active cart items.
     */
    List<CartItem> saveForLater(String bookId);

    /**
     * Moves a saved item back to the active cart.
     * @param bookId The ID of the book to move back.
     * @return Updated list of active cart items.
     */
    List<CartItem> moveToCart(String bookId);

    /**
     * Returns all items saved for later.
     * @return List of saved items.
     */
    List<CartItem> getSavedItems();

    /**
     * Returns all active cart items.
     * @return List of active cart items.
     */
    List<CartItem> getCartItems();

    /**
     * Clears the entire cart.
     */
    void clearCart();

    /**
     * Returns the number of items in the cart.
     * @return Item count.
     */
    int getCartCount();
}
