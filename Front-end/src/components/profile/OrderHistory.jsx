import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orders as ordersApi } from '../../services/api';

const STATUS_STYLES = {
  DELIVERED:  { bg: 'rgba(0,200,100,0.15)',  color: '#00c864' },
  CONFIRMED:  { bg: 'rgba(74,222,128,0.15)', color: '#4ade80' },
  SHIPPED:    { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
  PENDING:    { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37' },
  CANCELLED:  { bg: 'rgba(139,0,0,0.15)',    color: '#cc0000' },
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orderList,  setOrderList]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  useEffect(() => {
    if (!user?.id) return;
    ordersApi.getHistory(user.id).then(({ ok, data }) => {
      if (ok && Array.isArray(data)) setOrderList(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : '';

  const statusStyle = (status) =>
    STATUS_STYLES[(status || '').toUpperCase()] || { bg: 'rgba(100,100,100,0.15)', color: '#999' };

  if (loading) return <div style={{ color:'#D4AF37', padding:'2rem' }}>Loading orders…</div>;

  return (
    <div>
      <h2 className="profile-section-title">
        Order History ({orderList.length} {orderList.length === 1 ? 'order' : 'orders'})
      </h2>

      {orderList.length === 0 ? (
        <div className="profile-empty-state">
          <span className="profile-empty-state-icon">📦</span>
          <p>No orders yet — start shopping!</p>
        </div>
      ) : orderList.map((order) => {
        const { bg, color } = statusStyle(order.status);
        const items = Array.isArray(order.items) ? order.items : [];
        return (
          <div key={order.id} style={{
            background: 'var(--profile-sub-card-bg)',
            border: '1px solid var(--profile-sub-card-border)',
            borderRadius: '16px', padding: '20px', marginBottom: '16px',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
              <span style={{ color:'#D4AF37', fontWeight:700, fontSize:'0.95rem', fontFamily:'monospace' }}>
                {order.id}
              </span>
              <span style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>{formatDate(order.createdAt)}</span>
              <span style={{ background:bg, color, borderRadius:'20px', padding:'4px 12px', fontSize:'0.75rem', fontWeight:600 }}>
                {order.status}
              </span>
            </div>

            {items.length > 0 && (
              <div style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:'14px' }}>
                📚 {items.map(i => i.title || i).join(', ')}
              </div>
            )}

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
              <span style={{ color:'#D4AF37', fontWeight:700, fontSize:'1rem' }}>
                ${Number(order.totalPrice || 0).toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}

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
