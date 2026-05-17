// src/components/checkout/OrderConfirmation.jsx
// Member 5 – Vishnu
import { useParams, Link } from 'react-router-dom';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="checkmark-circle">✓</div>
        <h1>Order Confirmed!</h1>
        <p className="confirm-subtitle">
          Thank you for your purchase. Your books are on their way!
        </p>
        <div className="order-id-box">
          <span className="order-label">Order ID</span>
          <span className="order-id">{orderId}</span>
        </div>
        <div className="confirmation-info">
          <div className="info-item">📦 <span>You'll receive a confirmation shortly</span></div>
          <div className="info-item">🚚 <span>Track your order in Profile → Order History</span></div>
          <div className="info-item">📖 <span>Happy reading!</span></div>
        </div>
        <div className="confirmation-actions">
          <Link to="/profile" className="track-btn">View Order History</Link>
          <Link to="/books"   className="shop-more-btn">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
