import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const STATUS_STYLES = {
  Delivered:  { bg: 'rgba(0,200,100,0.15)',   color: '#00c864' },
  Processing: { bg: 'rgba(212,175,55,0.15)',  color: '#D4AF37' },
  Cancelled:  { bg: 'rgba(139,0,0,0.15)',     color: '#cc0000' },
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  useEffect(() => {
    if (!user?.id) return;

    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = existing.filter((o) => String(o.userID) === String(user.id));

    if (userOrders.length === 0) {
      const dummy = [
        { orderID: 'ORD-1001', userID: user.id, date: '2025-03-15T10:30:00Z', status: 'Delivered',  totalAmount: 4500, items: ['The Great Gatsby', '1984'] },
        { orderID: 'ORD-1002', userID: user.id, date: '2025-04-02T14:00:00Z', status: 'Processing', totalAmount: 1800, items: ['To Kill a Mockingbird'] },
        { orderID: 'ORD-1003', userID: user.id, date: '2025-04-20T09:15:00Z', status: 'Cancelled',  totalAmount: 2700, items: ['Pride and Prejudice', 'Brave New World'] },
      ];
      localStorage.setItem('orders', JSON.stringify([...existing, ...dummy]));
      setOrders(dummy);
    } else {
      setOrders(userOrders);
    }
  }, [user]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleReorder = (order) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const pricePerItem = Math.round(order.totalAmount / order.items.length);
    let added = 0;
    order.items.forEach((title, i) => {
      if (!cart.find((c) => c.title === title)) {
        cart.push({ id: Date.now() + i, title, quantity: 1, userID: user.id, price: pricePerItem });
        added++;
      }
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    showToast(added > 0 ? 'Items added to cart!' : 'All items already in cart!');
  };

  const handleDeleteConfirm = (orderID) => {
    const all = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify(all.filter((o) => o.orderID !== orderID)));
    setOrders((prev) => prev.filter((o) => o.orderID !== orderID));
    setConfirmId(null);
    showToast('Order deleted');
  };

  const statusStyle = (status) => STATUS_STYLES[status] || { bg: 'rgba(100,100,100,0.15)', color: '#999' };

  return (
    <div>
      <h2 className="profile-section-title">
        Order History ({orders.length} {orders.length === 1 ? 'order' : 'orders'})
      </h2>

      {orders.length === 0 ? (
        <div className="profile-empty-state">
          <span className="profile-empty-state-icon">📦</span>
          <p>No orders yet — start shopping!</p>
        </div>
      ) : (
        orders.map((order) => {
          const { bg, color } = statusStyle(order.status);
          const isConfirming = confirmId === order.orderID;

          return (
            <div
              key={order.orderID}
              style={{
                background: 'var(--profile-sub-card-bg)',
                border: '1px solid var(--profile-sub-card-border)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.95rem' }}>
                  {order.orderID}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {formatDate(order.date)}
                </span>
                <span style={{
                  background: bg, color, borderRadius: '20px',
                  padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600,
                }}>
                  {order.status}
                </span>
              </div>

              {/* Items row */}
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
                📚 Items: {order.items.join(', ')}
              </div>

              {/* Bottom row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '1rem' }}>
                  LKR {order.totalAmount.toLocaleString()}
                </span>

                {isConfirming ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Sure?</span>
                    <button
                      className="profile-btn-danger"
                      style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                      onClick={() => handleDeleteConfirm(order.orderID)}
                    >
                      Yes
                    </button>
                    <button
                      className="profile-btn-outline"
                      style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                      onClick={() => setConfirmId(null)}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      className="profile-btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                      onClick={() => handleReorder(order)}
                    >
                      🔁 Reorder
                    </button>
                    <button
                      className="profile-btn-danger"
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                      onClick={() => setConfirmId(order.orderID)}
                    >
                      🗑️ Delete Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {toast && (
        <div className="notification-toast animate-slide-in">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
