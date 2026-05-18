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
  { tempId: 1, name: 'Eleanor Vance', text: 'The curation here is absolutely unmatched. I found first editions I have been seeking for years.', rating: 5, role: 'Collector', imgSrc: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { tempId: 2, name: 'James Morrison', text: 'The packaging alone is an experience. Truly a luxury destination for bibliophiles.', rating: 5, role: 'Author', imgSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { tempId: 3, name: 'Sophia Chen', text: 'Fast global shipping and the customer service is as premium as the books they sell.', rating: 5, role: 'Avid Reader', imgSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { tempId: 4, name: 'Daniel Foster', text: 'If I could give 11 stars, I would. This is the only bookstore I use now.', rating: 5, role: 'History Buff', imgSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { tempId: 5, name: 'Amelia Rose', text: 'The best UI and shopping experience I have ever seen for buying books.', rating: 5, role: 'Designer', imgSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
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

  // ── Animated Hero Titles ──
  const [titleIndex, setTitleIndex] = useState(0);
  const heroTitles = ["Great Adventure", "Rare Edition", "Masterpiece", "Next Obsession", "Timeless Classic"];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleIndex((prev) => (prev + 1) % heroTitles.length);
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleIndex, heroTitles.length]);

  // ── Staggered Testimonials State ──
  const [testimonialsList, setTestimonialsList] = useState(REVIEWS);
  const [cardSize, setCardSize] = useState(380);

  useEffect(() => {
    const updateSize = () => setCardSize(window.innerWidth > 640 ? 380 : 300);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMoveReviews = (steps) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (item) newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (item) newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

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
        <div className="hero-content animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="hero-badge">
            <span className="badge-text">Read our launch article</span>
            <svg className="badge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          
          <h1 className="hero-title" style={{ textAlign: 'center' }}>
            Discover Your <br />
            <div className="animated-title-wrapper">
              {heroTitles.map((title, index) => {
                let yOffset = 100;
                let opacity = 0;
                if (titleIndex === index) { yOffset = 0; opacity = 1; } 
                else if (titleIndex > index) { yOffset = -150; opacity = 0; }
                else { yOffset = 150; opacity = 0; }
                
                return (
                  <span
                    key={index}
                    className="animated-title-text gradient-text"
                    style={{
                      transform: `translateY(${yOffset}%)`,
                      opacity: opacity,
                      position: titleIndex === index ? 'relative' : 'absolute',
                      top: 0, left: 0, right: 0,
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    {title}
                  </span>
                );
              })}
            </div>
          </h1>
          <p className="hero-subtitle" style={{ textAlign: 'center' }}>
            Managing your literary collection is already tough. Avoid further complications by ditching outdated methods. Our goal is to streamline your reading journey, making it easier and faster than ever.
          </p>
          <div className="hero-buttons">
            <Link to="/contact" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              Jump on a call <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </Link>
            <Link to="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              Sign up here <svg className="badge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
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

      {/* ── Client Testimonials (Staggered 3D Carousel) ── */}
      <section className="premium-section cinematic-reviews-section">
        <div className="cinematic-glow"></div>
        <div className="section-header center-header" style={{ position: 'relative', zIndex: 1, marginBottom: 0 }}>
          <h2 className="section-title">Voices of the Inner Circle</h2>
          <p className="section-subtitle">What our readers say about the luxury experience.</p>
        </div>
        
        <div className="stagger-testimonials-container">
          {testimonialsList.map((review, index) => {
            const position = testimonialsList.length % 2
              ? index - (testimonialsList.length - 1) / 2
              : index - testimonialsList.length / 2;
            const isCenter = position === 0;

            return (
              <div
                key={review.tempId}
                onClick={() => handleMoveReviews(position)}
                className={`stagger-card ${isCenter ? 'center-card' : 'side-card'}`}
                style={{
                  width: cardSize,
                  height: cardSize,
                  transform: `
                    translate(-50%, -50%) 
                    translateX(${(cardSize / 1.5) * position}px)
                    translateY(${isCenter ? -30 : position % 2 ? 15 : -15}px)
                    rotate(${isCenter ? 0 : position % 2 ? 4 : -4}deg)
                  `,
                  zIndex: isCenter ? 10 : 0,
                }}
              >
                <div className="review-quote-icon">"</div>
                <div className="review-rating">
                  {'★'.repeat(Math.floor(review.rating))}{'☆'.repeat(5-Math.floor(review.rating))}
                </div>
                <p className="review-text">{review.text}</p>
                <div className="review-author">
                  <img src={review.imgSrc} alt={review.name} className="author-avatar" />
                  <div className="author-info">
                    <h4>{review.name}</h4>
                    <span>{review.role}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="stagger-controls">
            <button onClick={() => handleMoveReviews(-1)} className="stagger-btn" aria-label="Previous">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={() => handleMoveReviews(1)} className="stagger-btn" aria-label="Next">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
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
