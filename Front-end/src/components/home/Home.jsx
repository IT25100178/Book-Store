import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { books as booksApi } from '../../services/api';
import BookImage from '../books/BookImage';
import './Home.css';

const CATEGORIES = [
  { name: 'Fiction',   icon: '📖', color: 'rgba(223, 177, 99, 0.2)' },
  { name: 'Classic',   icon: '📜', color: 'rgba(122, 0, 22, 0.2)' },
  { name: 'Fantasy',   icon: '🐉', color: 'rgba(75, 0, 130, 0.2)' },
  { name: 'Romance',   icon: '💕', color: 'rgba(199, 21, 133, 0.2)' },
  { name: 'Dystopian', icon: '🔮', color: 'rgba(47, 79, 79, 0.2)' },
  { name: 'Science',   icon: '🔬', color: 'rgba(0, 100, 0, 0.2)' },
];

const FEATURES = [
  { icon: '✨', title: 'Curated Excellence', text: 'Every book is hand-selected by our literary experts.' },
  { icon: '🛡️', title: 'Secure Packaging', text: 'Premium materials ensure your books arrive in pristine condition.' },
  { icon: '💎', title: 'First Editions', text: 'Exclusive access to rare, signed, and vintage copies.' }
];

const REVIEWS = [
  { id: 1, name: 'Eleanor Vance', text: 'The curation here is absolutely unmatched. I found first editions I have been seeking for years.', rating: 5, role: 'Collector' },
  { id: 2, name: 'James Morrison', text: 'The packaging alone is an experience. Truly a luxury destination for bibliophiles.', rating: 5, role: 'Author' },
  { id: 3, name: 'Sophia Chen', text: 'Fast global shipping and the customer service is as premium as the books they sell.', rating: 5, role: 'Avid Reader' },
];

export default function Home() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    booksApi.list({ pageSize: 4 }).then(({ ok, data }) => {
      if (ok && data.books?.length) setFeaturedBooks(data.books.slice(0, 4));
    });
    booksApi.list({ sortBy: 'rating_desc', pageSize: 6 }).then(({ ok, data }) => {
      if (ok && data.books?.length) setBestSellers(data.books.slice(0, 6));
    });
  }, []);

  const showNotif = (msg) => { 
    setNotification(msg); 
    setTimeout(() => setNotification(''), 3000); 
  };

  const handleAddToCart = async (book) => {
    if (!user) { navigate('/login'); return; }
    const r = await addToCart(book.id, 1);
    showNotif(r.success ? `"${book.title}" added to cart!` : 'Failed to add to cart');
  };

  return (
    <div className="home-wrapper">
      {/* ── Notification ── */}
      {notification && (
        <div className="glass-notification animate-slide-down">
          {notification}
        </div>
      )}

      {/* ── Premium Hero Section ── */}
      <section className="premium-hero" style={{ 
        backgroundImage: `linear-gradient(to right, rgba(5, 5, 8, 0.95), rgba(5, 5, 8, 0.7)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="hero-content animate-slide-up">
          <h1 className="hero-title">
            Discover Your Next <br /> <span className="gradient-text">Great Adventure</span>
          </h1>
          <p className="hero-subtitle">
            Immerse yourself in our curated collection of luxury books. From timeless classics to modern masterpieces, find the stories that speak to your soul.
          </p>
          <div className="hero-buttons">
            <Link to="/books" className="btn-primary">Explore Collection</Link>
            <Link to="/books?category=Best Sellers" className="btn-secondary">View Best Sellers</Link>
          </div>
        </div>
      </section>

      {/* ── Marquee (Running Text) ── */}
      <div className="premium-marquee">
        <div className="marquee-content">
          <span>✨ Free Global Shipping over $50</span>
          <span className="dot">•</span>
          <span>📚 Curated First Editions</span>
          <span className="dot">•</span>
          <span>💎 Premium Member Benefits</span>
          <span className="dot">•</span>
          <span>🛡️ Secure Luxury Packaging</span>
          <span className="dot">•</span>
          <span>✨ Free Global Shipping over $50</span>
          <span className="dot">•</span>
          <span>📚 Curated First Editions</span>
          <span className="dot">•</span>
          <span>💎 Premium Member Benefits</span>
        </div>
      </div>

      {/* ── Why Choose Us (Features) ── */}
      <section className="premium-section">
        <div className="section-header center-header">
          <h2 className="section-title">The Luxury Experience</h2>
          <p className="section-subtitle">Why bibliophiles choose us worldwide.</p>
        </div>
        <div className="features-glass-grid">
          {FEATURES.map((feature, i) => (
            <div key={i} className="glass-card feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="premium-section">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
        </div>
        <div className="categories-glass-grid">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/books?category=${cat.name}`}
              className="glass-card category-glass-card"
              style={{ '--cat-bg': cat.color }}
            >
              <div className="cat-icon-wrapper">{cat.icon}</div>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Books Section ── */}
      {featuredBooks.length > 0 && (
        <section className="premium-section">
          <div className="section-header">
            <h2 className="section-title">Featured Selection</h2>
            <Link to="/books" className="view-all-link">View All <span>→</span></Link>
          </div>
          <div className="books-glass-grid">
            {featuredBooks.map(book => (
              <div key={book.id} className="glass-card book-glass-card">
                <div className="book-image-placeholder">
                  <BookImage title={book.title} featuredImage={book.featuredImage} />
                </div>
                <div className="book-details">
                  <span className="book-category-badge">{book.category}</span>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-footer">
                    <span className="book-price">${Number(book.price).toFixed(2)}</span>
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(book)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Best Sellers Section ── */}
      {bestSellers.length > 0 && (
        <section className="premium-section">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <Link to="/books?sortBy=rating_desc" className="view-all-link">View All <span>→</span></Link>
          </div>
          <div className="books-glass-grid">
            {bestSellers.map(book => (
              <div key={book.id} className="glass-card book-glass-card">
                <div className="book-image-placeholder">
                  <BookImage title={book.title} featuredImage={book.featuredImage} />
                </div>
                <div className="book-details">
                  <div className="book-rating">
                    {'★'.repeat(Math.floor(book.rating || 0))}{'☆'.repeat(5-Math.floor(book.rating || 0))}
                  </div>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-footer">
                    <span className="book-price">${Number(book.price).toFixed(2)}</span>
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(book)}>
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Client Testimonials ── */}
      <section className="premium-section">
        <div className="section-header">
          <h2 className="section-title">Reader Testimonials</h2>
        </div>
        <div className="reviews-glass-grid">
          {REVIEWS.map(review => (
            <div key={review.id} className="glass-card review-card">
              <div className="review-rating">
                {'★'.repeat(Math.floor(review.rating))}{'☆'.repeat(5-Math.floor(review.rating))}
              </div>
              <p className="review-text">"{review.text}"</p>
              <div className="review-author">
                <div className="author-avatar">{review.name.charAt(0)}</div>
                <div className="author-info">
                  <h4>{review.name}</h4>
                  <span>{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="premium-section newsletter-section">
        <div className="glass-card newsletter-card">
          <h2>Join the Inner Circle</h2>
          <p>Subscribe to receive exclusive access to rare drops, literary events, and member benefits.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); showNotif('Subscribed successfully!'); e.target.reset(); }}>
            <input type="email" placeholder="Enter your email address..." required className="newsletter-input" />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
