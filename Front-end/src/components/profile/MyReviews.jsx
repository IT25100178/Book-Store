import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { users as usersApi } from '../../services/api';

export default function MyReviews() {
  const { user } = useAuth();
  const [reviews,   setReviews]   = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [toast,     setToast]     = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  useEffect(() => {
    if (!user?.id) return;
    usersApi.getReviews(user.id).then(({ ok, data }) => {
      if (ok && Array.isArray(data)) setReviews(data);
    });
  }, [user]);

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : '';

  const renderStars = (rating) => '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));

  const handleDelete = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    setConfirmId(null);
    showToast('Review deleted');
  };

  return (
    <div>
      <h2 className="profile-section-title">
        My Reviews ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
      </h2>

      {reviews.length === 0 ? (
        <div className="profile-empty-state">
          <span className="profile-empty-state-icon">⭐</span>
          <p>You haven't written any reviews yet</p>
        </div>
      ) : reviews.map((review) => {
        const isConfirming = confirmId === review.id;
        return (
          <div key={review.id} style={{
            background:'var(--profile-sub-card-bg)', border:'1px solid var(--profile-sub-card-border)',
            borderRadius:'16px', padding:'20px', marginBottom:'16px',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'8px', marginBottom:'8px' }}>
              <span style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'1rem' }}>
                {review.bookTitle || review.bookId}
              </span>
              <span style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>{formatDate(review.date)}</span>
            </div>
            <div style={{ color:'#D4AF37', fontSize:'1rem', letterSpacing:'2px', marginBottom:'10px' }}>
              {renderStars(review.rating)}
            </div>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', fontStyle:'italic', lineHeight:1.6, marginBottom:'16px' }}>
              "{review.comment || review.reviewText}"
            </p>
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              {isConfirming ? (
                <div style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'0.85rem' }}>
                  <span>Sure?</span>
                  <button className="profile-btn-danger"  style={{ padding:'6px 16px', fontSize:'0.82rem' }} onClick={() => handleDelete(review.id)}>Yes</button>
                  <button className="profile-btn-outline" style={{ padding:'6px 16px', fontSize:'0.82rem' }} onClick={() => setConfirmId(null)}>No</button>
                </div>
              ) : (
                <button className="profile-btn-danger" style={{ padding:'8px 16px', fontSize:'0.82rem' }} onClick={() => setConfirmId(review.id)}>🗑️ Delete Review</button>
              )}
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
