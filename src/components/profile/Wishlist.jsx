import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  useEffect(() => {
    if (!user?.id) return;

    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const userItems = existing.filter((i) => String(i.userID) === String(user.id));

    if (userItems.length === 0) {
      const dummy = [
        { id: 1, userID: user.id, title: 'The Great Gatsby',       author: 'F. Scott Fitzgerald', price: 1500, image: 'https://covers.openlibrary.org/b/id/8432167-M.jpg', rating: 4.5 },
        { id: 2, userID: user.id, title: 'To Kill a Mockingbird',  author: 'Harper Lee',           price: 1800, image: 'https://covers.openlibrary.org/b/id/8810494-M.jpg', rating: 4.8 },
        { id: 3, userID: user.id, title: '1984',                   author: 'George Orwell',        price: 1200, image: 'https://covers.openlibrary.org/b/id/8575708-M.jpg', rating: 4.7 },
        { id: 4, userID: user.id, title: 'Pride and Prejudice',    author: 'Jane Austen',          price: 1350, image: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', rating: 4.6 },
      ];
      localStorage.setItem('wishlist', JSON.stringify([...existing, ...dummy]));
      setWishlist(dummy);
    } else {
      setWishlist(userItems);
    }
  }, [user]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.find((c) => c.id === item.id)) {
      showToast('Already in cart!');
      return;
    }
    cart.push({ id: item.id, title: item.title, author: item.author, price: item.price, image: item.image, quantity: 1, userID: user.id });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    showToast('Added to cart!');
  };

  const removeItem = (itemId) => {
    const all = JSON.parse(localStorage.getItem('wishlist') || '[]');
    localStorage.setItem('wishlist', JSON.stringify(all.filter((i) => !(String(i.userID) === String(user.id) && i.id === itemId))));
    setWishlist((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Removed from wishlist');
  };

  const renderStars = (rating) => {
    const filled = Math.round(rating);
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
      ) : (
        wishlist.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: '16px',
              background: 'var(--profile-sub-card-bg)',
              border: '1px solid var(--profile-sub-card-border)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '14px',
              alignItems: 'flex-start',
            }}
          >
            {/* Book cover */}
            <img
              src={item.image}
              alt={item.title}
              style={{ width: '60px', height: '80px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            {/* Details */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '3px' }}>
                {item.title}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '5px' }}>
                by {item.author}
              </div>
              <div style={{ color: '#D4AF37', fontSize: '0.88rem', letterSpacing: '2px', marginBottom: '5px' }}>
                {renderStars(item.rating)}
              </div>
              <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.95rem', marginBottom: '14px' }}>
                LKR {item.price.toLocaleString()}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className="profile-btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  onClick={() => addToCart(item)}
                >
                  🛒 Add to Cart
                </button>
                <button
                  className="profile-btn-danger"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  onClick={() => removeItem(item.id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          </div>
        ))
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
