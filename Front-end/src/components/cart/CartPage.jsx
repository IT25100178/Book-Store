// src/components/cart/CartPage.jsx
// Member 4 – Lojeni
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, applyDiscount } = useCart();
  const navigate = useNavigate();

  const [discountCode,    setDiscountCode]    = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountMsg,     setDiscountMsg]     = useState('');
  const [discountError,   setDiscountError]   = useState('');
  const [savedItems,      setSavedItems]      = useState([]);
  const [notification,    setNotification]    = useState('');

  // ── Calculated values ─────────────────────────────────────────────────────

  const discountAmount   = (cartTotal * discountPercent) / 100;
  const afterDiscount    = cartTotal - discountAmount;
  const tax              = afterDiscount * 0.08;
  const delivery         = afterDiscount >= 50 ? 0 : 4.99;
  const grandTotal       = afterDiscount + tax + delivery;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleApplyDiscount = async () => {
    setDiscountMsg('');
    setDiscountError('');
    const result = await applyDiscount(discountCode);
    if (result.success) {
      setDiscountPercent(result.discountPercent);
      setDiscountMsg(result.message);
    } else {
      setDiscountPercent(0);
      setDiscountError(result.message || 'Invalid code');
    }
  };

  const handleSaveForLater = (item) => {
    setSavedItems(prev => [...prev, item]);
    removeFromCart(item.bookId);
    showNotif(`${item.book?.title} saved for later`);
  };

  const handleMoveToCart = (item) => {
    setSavedItems(prev => prev.filter(s => s.bookId !== item.bookId));
    // Re-add to cart via context
    showNotif(`${item.book?.title} moved to cart`);
  };

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any books yet.</p>
          <Link to="/books" className="continue-btn">Browse Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {notification && <div className="cart-notification">{notification}</div>}

      <div className="cart-header-section">
        <h1>Shopping Cart</h1>
        <span className="cart-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-layout">

        {/* ── Cart Items ──────────────────────────────────────────────────── */}
        <div className="cart-items-section">
          {cartItems.map((item) => (
            <div key={item.bookId} className="cart-item-card">
              <div className="cart-item-emoji">{item.book?.image || '📖'}</div>

              <div className="cart-item-info">
                <h3 className="cart-item-title">{item.book?.title || 'Book'}</h3>
                <p className="cart-item-author">by {item.book?.author}</p>
                <p className="cart-item-category">{item.book?.category}</p>
              </div>

              <div className="cart-item-controls">
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >+</button>
                </div>

                <div className="cart-item-price-col">
                  <span className="cart-item-current">${(item.book?.price * item.quantity).toFixed(2)}</span>
                  {item.book?.originalPrice > item.book?.price && (
                    <span className="cart-item-original">
                      ${(item.book.originalPrice * item.quantity).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="cart-item-actions">
                  <button className="save-later-btn" onClick={() => handleSaveForLater(item)}>
                    💾 Save
                  </button>
                  <button className="remove-btn" onClick={() => removeFromCart(item.bookId)}
                    aria-label="Remove item">
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* ── Continue Shopping ────────────────────────────────────────── */}
          <Link to="/books" className="continue-shopping-link">
            ← Continue Shopping
          </Link>

          {/* ── Saved for Later ──────────────────────────────────────────── */}
          {savedItems.length > 0 && (
            <div className="saved-section">
              <h3>Saved for Later ({savedItems.length})</h3>
              {savedItems.map((item) => (
                <div key={item.bookId} className="saved-item">
                  <span className="saved-emoji">{item.book?.image || '📖'}</span>
                  <div className="saved-info">
                    <strong>{item.book?.title}</strong>
                    <span>${item.book?.price}</span>
                  </div>
                  <button className="move-to-cart-btn" onClick={() => handleMoveToCart(item)}>
                    Move to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Order Summary ────────────────────────────────────────────────── */}
        <div className="order-summary-card">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({cartCount} items)</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          {/* ── Discount Code ──────────────────────────────────────────────── */}
          <div className="discount-section">
            <label htmlFor="discount-code">Apply Discount Code</label>
            <div className="discount-input-row">
              <input
                id="discount-code"
                type="text"
                placeholder="e.g. STUDENT20"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              />
              <button className="apply-btn" onClick={handleApplyDiscount}>Apply</button>
            </div>
            {discountMsg   && <p className="discount-success">{discountMsg}</p>}
            {discountError && <p className="discount-error">{discountError}</p>}
          </div>

          {discountAmount > 0 && (
            <div className="summary-row discount-row">
              <span>Discount ({discountPercent}%)</span>
              <span className="discount-value">−${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>{delivery === 0 ? <span className="free-delivery">FREE</span> : `$${delivery.toFixed(2)}`}</span>
          </div>

          {delivery > 0 && (
            <p className="free-delivery-hint">
              Add ${(50 - afterDiscount).toFixed(2)} more for free delivery
            </p>
          )}

          <div className="summary-total">
            <span>Total</span>
            <span className="grand-total">${grandTotal.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout →
          </button>

          <div className="secure-badge">🔒 Secure 256-bit SSL Checkout</div>
        </div>
      </div>
    </div>
  );
}
