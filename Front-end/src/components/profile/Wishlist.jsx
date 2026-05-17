// Wishlist.jsx – Member 6 (Vishok)
// Uses Java backend API for wishlist operations
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { users as usersApi } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function Wishlist() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [toast,    setToast]    = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  useEffect(() => {
    if (!user?.id) return;
    usersApi.getWishlist(user.id).then(({ ok, data }) => {
      if (ok && Array.isArray(data)) setWishlist(data);
    });
  }, [user]);

  const handleAddToCart = async (item) => {
    const result = await addToCart(item.bookId || item.id, 1);
    showToast(result.success ? 'Added to cart!' : 'Failed to add');
  };

  const removeItem = async (itemId) => {
    await usersApi.removeFromWishlist(user.id, itemId);
    setWishlist(prev => prev.filter(i => i.id !== itemId));
    showToast('Removed from wishlist');
  };

  const renderStars = (rating) => {
    const filled = Math.round(rating || 0);
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  };

  return (
    <div>
      <h2 className="profile-section-title">
        Your Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
      </h2>

      {wishlist.length === 0 ? (
        <div className="profile-empty-state">
          <span className="profile-empty-state-icon">❤️</span>
          <p>Your wishlist is empty — browse books to add some!</p>
        </div>
      ) : wishlist.map((item) => (
        <div key={item.id} style={{
          display:'flex', gap:'16px',
          background:'var(--profile-sub-card-bg)',
          border:'1px solid var(--profile-sub-card-border)',
          borderRadius:'16px', padding:'16px', marginBottom:'14px', alignItems:'flex-start',
        }}>
          <div style={{ fontSize:'3rem', width:60, textAlign:'center' }}>{item.image || '📖'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'1rem', marginBottom:'3px' }}>
              {item.title || item.bookId}
            </div>
            <div style={{ color:'var(--text-muted)', fontSize:'0.82rem', marginBottom:'5px' }}>
              by {item.author || '—'}
            </div>
            <div style={{ color:'#D4AF37', fontSize:'0.88rem', letterSpacing:'2px', marginBottom:'5px' }}>
              {renderStars(item.rating)}
            </div>
            <div style={{ color:'#D4AF37', fontWeight:700, fontSize:'0.95rem', marginBottom:'14px' }}>
              ${Number(item.price || 0).toFixed(2)}
            </div>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <button className="profile-btn-primary"   style={{ padding:'8px 16px', fontSize:'0.82rem' }} onClick={() => handleAddToCart(item)}>🛒 Add to Cart</button>
              <button className="profile-btn-danger"    style={{ padding:'8px 16px', fontSize:'0.82rem' }} onClick={() => removeItem(item.id)}>🗑️ Remove</button>
            </div>
          </div>
        </div>
      ))}

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
