import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    savedItems,
    appliedDiscount,
    notification,
    cartCount,
    subtotal,
    totalSavings,
    tax,
    delivery,
    discountAmount,
    total,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    saveForLater,
    moveToCart,
    removeFromSaved,
    applyDiscountCode,
    removeDiscount,
  } = useCart();

  const [discountInput, setDiscountInput] = useState('');

  const handleApplyDiscount = () => {
    if (discountInput.trim()) {
      applyDiscountCode(discountInput);
      setDiscountInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleApplyDiscount();
  };

  // ─── Empty Cart View ────────────────────────────────────
  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="cart-page">
        {/* Notification */}
        {notification.show && (
          <div className={`cart-notification ${notification.type}`}>
            {notification.type === 'success' && '✓'}
            {notification.type === 'info' && 'ℹ'}
            {notification.type === 'error' && '✕'}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Top Bar */}
        <div className="cart-topbar">
          <div className="cart-topbar-brand" onClick={() => navigate('/')}>
            LUXURY<span>BOOKS</span>
          </div>
          <div className="cart-topbar-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="20" cy="21" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Shopping Cart
          </div>
          <div className="cart-topbar-actions" />
        </div>

        {/* Empty State */}
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="20" cy="21" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any luxury books yet. Explore our curated collection and find your next masterpiece.</p>
          <button className="empty-cart-browse-btn" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  // ─── Cart with Items ────────────────────────────────────
  return (
    <div className="cart-page">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`cart-notification ${notification.type}`}>
          {notification.type === 'success' && '✓'}
          {notification.type === 'info' && 'ℹ'}
          {notification.type === 'error' && '✕'}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="cart-topbar">
        <div className="cart-topbar-brand" onClick={() => navigate('/')}>
          LUXURY<span>BOOKS</span>
        </div>
        <div className="cart-topbar-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1.5" />
            <circle cx="20" cy="21" r="1.5" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Shopping Cart
        </div>
        <div className="cart-topbar-actions">
          <button className="continue-shopping-btn" style={{ width: 'auto', padding: '8px 20px' }} onClick={() => navigate('/')}>
            ← Continue Shopping
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="cart-header-section">
        <h1>Your Cart</h1>
        <p className="cart-item-count">
          {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {/* Main Layout */}
      {cartItems.length > 0 ? (
        <div className="cart-layout">
          {/* Left Column — Cart Items */}
          <div className="cart-items-column">
            {cartItems.map((item, index) => (
              <div
                className="cart-item-card"
                key={item.id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Book Image */}
                <div className="cart-item-emoji">{item.image}</div>

                {/* Details */}
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <p className="cart-item-author">by {item.author}</p>
                  <span className="cart-item-category">{item.category}</span>
                  <div className="cart-item-prices">
                    <span className="cart-item-price">${item.price.toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <>
                        <span className="cart-item-original-price">${item.originalPrice.toFixed(2)}</span>
                        <span className="cart-item-discount-badge">
                          -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right — Quantity + Actions */}
                <div className="cart-item-right">
                  <div className="cart-item-line-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => decreaseQuantity(item.id)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>

                  {/* Action Buttons */}
                  <div className="cart-item-actions">
                    <button className="action-btn" onClick={() => saveForLater(item.id)}>
                      ♡ Save for Later
                    </button>
                    <button className="action-btn remove" onClick={() => removeFromCart(item.id)}>
                      ✕ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column — Summary */}
          <div className="cart-summary-column">
            {/* Order Summary */}
            <div className="summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span className="label">Subtotal ({cartCount} items)</span>
                <span className="value">${subtotal.toFixed(2)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="summary-row savings">
                  <span className="label">Product Savings</span>
                  <span className="value">-${totalSavings.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span className="label">Tax (10%)</span>
                <span className="value">${tax.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span className="label">Delivery</span>
                <span className={`value ${delivery === 0 ? 'free' : ''}`}>
                  {delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`}
                </span>
              </div>

              {appliedDiscount && (
                <div className="summary-row discount">
                  <span className="label">Discount ({appliedDiscount.code})</span>
                  <span className="value">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-divider" />

              <div className="summary-total">
                <span className="label">Total</span>
                <span className="value">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount Code */}
            <div className="discount-section">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                Discount Code
              </h3>

              <div className="discount-input-row">
                <input
                  className="discount-input"
                  type="text"
                  placeholder="Enter code..."
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="discount-apply-btn" onClick={handleApplyDiscount}>
                  Apply
                </button>
              </div>

              {appliedDiscount && (
                <div className="applied-discount">
                  <div className="applied-discount-info">
                    <span className="code">✓ {appliedDiscount.code}</span>
                    <span className="amount">-${appliedDiscount.amount.toFixed(2)}</span>
                  </div>
                  <button className="remove-discount-btn" onClick={removeDiscount}>✕</button>
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <button className="checkout-action-btn" onClick={() => navigate('/checkout')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Proceed to Checkout
            </button>

            {/* Continue Shopping */}
            <button className="continue-shopping-btn" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="20" cy="21" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>All your items are saved for later. Move them back to continue shopping!</p>
        </div>
      )}

      {/* Saved for Later Section */}
      {savedItems.length > 0 && (
        <div className="saved-section">
          <div className="saved-section-header">
            <h2>♡ Saved for Later</h2>
            <span className="count">{savedItems.length} {savedItems.length === 1 ? 'item' : 'items'}</span>
          </div>

          <div className="saved-items-grid">
            {savedItems.map((item) => (
              <div className="saved-item-card" key={item.id}>
                <div className="saved-item-emoji">{item.image}</div>
                <div className="saved-item-info">
                  <h4>{item.title}</h4>
                  <span className="price">${item.price.toFixed(2)}</span>
                </div>
                <div className="saved-item-actions">
                  <button className="saved-move-btn" onClick={() => moveToCart(item.id)}>
                    Move to Cart
                  </button>
                  <button className="saved-remove-btn" onClick={() => removeFromSaved(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
