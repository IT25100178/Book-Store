// src/components/checkout/CheckoutPage.jsx
// Member 5 – Vishnu
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orders as ordersApi } from '../../services/api';
import './CheckoutPage.css';

const DELIVERY_OPTIONS = [
  { id: 'STANDARD', label: 'Standard Delivery',  time: '5–7 business days',  price: 4.99 },
  { id: 'EXPRESS',  label: 'Express Delivery',    time: '1–2 business days',  price: 9.99 },
  { id: 'FREE',     label: 'Free Delivery',       time: '7–10 business days', price: 0,    minOrder: 50 },
];

const PAYMENT_METHODS = [
  { id: 'COD',    label: 'Cash on Delivery',   icon: '💵', desc: 'Pay when your books arrive' },
  { id: 'ONLINE', label: 'Online Payment',      icon: '💳', desc: 'Credit / Debit card or bank transfer' },
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // ── Form state ────────────────────────────────────────────────────────────
  const [address,        setAddress]       = useState({
    fullName: user?.name || '',
    phone:    user?.phone || '',
    line1:    '',
    city:     '',
    state:    '',
    zip:      '',
    country:  'Sri Lanka',
  });
  const [deliveryOption,  setDeliveryOption]  = useState('STANDARD');
  const [paymentMethod,   setPaymentMethod]   = useState('COD');
  const [discountCode,    setDiscountCode]    = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountMsg,     setDiscountMsg]     = useState('');
  const [loading,         setLoading]         = useState(false);
  const [errors,          setErrors]          = useState({});

  // ── Calculations ──────────────────────────────────────────────────────────

  const discount     = (cartTotal * discountPercent) / 100;
  const afterDisc    = cartTotal - discount;
  const tax          = afterDisc * 0.08;
  const chosenDel    = DELIVERY_OPTIONS.find(d => d.id === deliveryOption);
  const deliveryFee  = deliveryOption === 'FREE' ? (afterDisc >= 50 ? 0 : 4.99) : (chosenDel?.price || 0);
  const grandTotal   = afterDisc + tax + deliveryFee;

  // ── Validate ──────────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = 'Full name is required';
    if (!address.phone.trim())    e.phone    = 'Phone is required';
    if (!address.line1.trim())    e.line1    = 'Address is required';
    if (!address.city.trim())     e.city     = 'City is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Build items string ────────────────────────────────────────────────────

  const buildItemsString = () =>
    cartItems.map(i => `${i.bookId}:${i.quantity}`).join(',');

  const buildAddressString = () =>
    `${address.fullName}, ${address.line1}, ${address.city}, ${address.state} ${address.zip}, ${address.country} | ${address.phone}`;

  // ── Place Order ───────────────────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const { ok, data } = await ordersApi.place({
        userId:         user.id,
        items:          buildItemsString(),
        subtotal:       cartTotal,
        discountCode,
        discountAmount: discount,
        paymentMethod,
        address:        buildAddressString(),
        deliveryType:   deliveryOption,
      });

      if (ok && data.success) {
        await clearCart();
        navigate(`/order-confirmation/${data.orderId}`);
      } else {
        setErrors({ general: data.message || 'Order failed. Please try again.' });
      }
    } catch {
      setErrors({ general: 'Cannot connect to server.' });
    }
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <span>🛒</span>
          <h2>No items to checkout</h2>
          <button onClick={() => navigate('/books')} className="back-to-books-btn">
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">

        {/* ── Left Column ─────────────────────────────────────────────────── */}
        <div className="checkout-left">

          {/* Shipping Address */}
          <section className="checkout-section">
            <h2>📍 Shipping Address</h2>
            <div className="form-grid">
              {[
                { key: 'fullName', label: 'Full Name',   type: 'text',  placeholder: 'Athethan Vishok' },
                { key: 'phone',    label: 'Phone Number',type: 'tel',   placeholder: '+94 77 123 4567' },
                { key: 'line1',    label: 'Address',     type: 'text',  placeholder: '132/1 Thalaiyadi Lane', full: true },
                { key: 'city',     label: 'City',        type: 'text',  placeholder: 'Jaffna' },
                { key: 'state',    label: 'Province',    type: 'text',  placeholder: 'Northern Province' },
                { key: 'zip',      label: 'ZIP Code',    type: 'text',  placeholder: '40000' },
              ].map(({ key, label, type, placeholder, full }) => (
                <div key={key} className={`form-field ${full ? 'full-width' : ''}`}>
                  <label htmlFor={key}>{label}</label>
                  <input
                    id={key}
                    type={type}
                    placeholder={placeholder}
                    value={address[key]}
                    onChange={(e) => setAddress(prev => ({ ...prev, [key]: e.target.value }))}
                    className={errors[key] ? 'field-error' : ''}
                  />
                  {errors[key] && <span className="error-msg">{errors[key]}</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Options */}
          <section className="checkout-section">
            <h2>🚚 Delivery Options</h2>
            <div className="delivery-options">
              {DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`delivery-option ${deliveryOption === opt.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.id}
                    checked={deliveryOption === opt.id}
                    onChange={() => setDeliveryOption(opt.id)}
                  />
                  <div className="delivery-info">
                    <strong>{opt.label}</strong>
                    <span>{opt.time}</span>
                    {opt.minOrder && <span className="min-order">Min. order ${opt.minOrder}</span>}
                  </div>
                  <div className="delivery-price">
                    {opt.price === 0 ? <span className="free-tag">FREE</span> : `$${opt.price.toFixed(2)}`}
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h2>💳 Payment Method</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.id}
                  className={`payment-option ${paymentMethod === pm.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)}
                  />
                  <span className="payment-icon">{pm.icon}</span>
                  <div className="payment-info">
                    <strong>{pm.label}</strong>
                    <span>{pm.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* ── Order Summary ────────────────────────────────────────────────── */}
        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.bookId} className="summary-item">
                <span className="summary-emoji">{item.book?.image || '📖'}</span>
                <div className="summary-item-info">
                  <span className="summary-item-title">{item.book?.title}</span>
                  <span className="summary-item-qty">×{item.quantity}</span>
                </div>
                <span className="summary-item-price">
                  ${(item.book?.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-rows">
            <div className="s-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="s-row green"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>}
            <div className="s-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="s-row"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span></div>
            <div className="s-row total-row"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
          </div>

          {errors.general && <p className="general-error">{errors.general}</p>}

          <button
            id="place-order-btn"
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order…' : `Place Order · $${grandTotal.toFixed(2)}`}
          </button>

          <p className="secure-note">🔒 Your payment information is secure</p>
        </aside>
      </div>
    </div>
  );
}
