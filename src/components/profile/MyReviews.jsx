import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function MyReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  useEffect(() => {
    if (!user?.id) return;

    const existing = JSON.parse(localStorage.getItem('reviews') || '[]');
    const userReviews = existing.filter((r) => String(r.userID) === String(user.id));

    if (userReviews.length === 0) {
      const dummy = [
        {
          id: 1, userID: user.id, bookTitle: 'The Great Gatsby', rating: 5,
          reviewText: "An absolute masterpiece. Fitzgerald's prose is hauntingly beautiful and the story stays with you long after the last page.",
          date: '2025-03-20T12:00:00Z',
        },
        {
          id: 2, userID: user.id, bookTitle: '1984', rating: 4,
          reviewText: 'Deeply unsettling and brilliantly written. A must-read for understanding modern surveillance and political power.',
          date: '2025-04-05T08:30:00Z',
        },
        {
          id: 3, userID: user.id, bookTitle: 'To Kill a Mockingbird', rating: 5,
          reviewText: "A timeless story about justice, compassion and moral courage. Scout's perspective makes it both accessible and profound.",
          date: '2025-04-22T16:00:00Z',
        },
      ];
      localStorage.setItem('reviews', JSON.stringify([...existing, ...dummy]));
      setReviews(dummy);
    } else {
      setReviews(userReviews);
    }
  }, [user]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const renderStars = (rating) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const handleDeleteConfirm = (id) => {
    const all = JSON.parse(localStorage.getItem('reviews') || '[]');
    localStorage.setItem('reviews', JSON.stringify(all.filter((r) => r.id !== id)));
    setReviews((prev) => prev.filter((r) => r.id !== id));
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
      ) : (
        reviews.map((review) => {
          const isConfirming = confirmId === review.id;

          return (
            <div
              key={review.id}
              style={{
                background: 'var(--profile-sub-card-bg)',
                border: '1px solid var(--profile-sub-card-border)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              {/* Top row: title + date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                  {review.bookTitle}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', flexShrink: 0 }}>
                  {formatDate(review.date)}
                </span>
              </div>

              {/* Stars */}
              <div style={{ color: '#D4AF37', fontSize: '1rem', letterSpacing: '2px', marginBottom: '10px' }}>
                {renderStars(review.rating)}
              </div>

              {/* Review text */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '16px' }}>
                "{review.reviewText}"
              </p>

              {/* Delete button / inline confirm */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {isConfirming ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Sure?</span>
                    <button
                      className="profile-btn-danger"
                      style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                      onClick={() => handleDeleteConfirm(review.id)}
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
                  <button
                    className="profile-btn-danger"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    onClick={() => setConfirmId(review.id)}
                  >
                    🗑️ Delete Review
                  </button>
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
