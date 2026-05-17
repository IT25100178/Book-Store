// src/components/home/Home.jsx
// Member 1 – Athethan
// Adapted: removed localStorage cart (uses CartContext), fixed import paths, theme toggle preserved
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { books as booksApi } from '../../services/api';
import logoImg from '../../assets/Luxury books logo.png';
import './Home.css';

// Sample books for the hero/featured section (will also load from API)
const FEATURED_BOOKS = [
  { id: 1,  title: 'The Great Gatsby',       author: 'F. Scott Fitzgerald', price: 14.99, image: '📖', category: 'Fiction',   rating: 4.5 },
  { id: 2,  title: 'To Kill a Mockingbird',  author: 'Harper Lee',          price: 12.99, image: '📚', category: 'Classic',   rating: 4.8 },
  { id: 5,  title: 'The Hobbit',             author: 'J.R.R. Tolkien',      price: 15.99, image: '🐉', category: 'Fantasy',   rating: 4.9 },
  { id: 9,  title: 'The Lord of the Rings',  author: 'J.R.R. Tolkien',      price: 19.99, image: '🐉', category: 'Fantasy',   rating: 4.9 },
];

const CATEGORIES = [
  { name: 'Fiction',   icon: '📖', color: '#8B4513' },
  { name: 'Classic',   icon: '📜', color: '#8B0000' },
  { name: 'Fantasy',   icon: '🐉', color: '#4B0082' },
  { name: 'Romance',   icon: '💕', color: '#C71585' },
  { name: 'Dystopian', icon: '🔮', color: '#2F4F4F' },
  { name: 'Science',   icon: '🔬', color: '#006400' },
];

export default function Home() {
  const { user, logout } = useAuth();
  const { cartCount, addToCart } = useCart();
  const navigate    = useNavigate();
  const [searchTerm, setSearchTerm]   = useState('');
  const [featuredBooks, setFeaturedBooks] = useState(FEATURED_BOOKS);
  const [latestBooks,   setLatestBooks]   = useState([]);
  const [bestSellers,   setBestSellers]   = useState([]);
  const [heroIdx,       setHeroIdx]       = useState(0);
  const [theme,         setTheme]         = useState(() => localStorage.getItem('theme') || 'dark');
  const [notification,  setNotification]  = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load featured books from API
  useEffect(() => {
    booksApi.list({ pageSize: 4 }).then(({ ok, data }) => {
      if (ok && data.books?.length) setFeaturedBooks(data.books.slice(0, 4));
    });
    booksApi.list({ sortBy: 'rating_desc', pageSize: 6 }).then(({ ok, data }) => {
      if (ok && data.books?.length) setBestSellers(data.books.slice(0, 6));
    });
    booksApi.list({ sortBy: '', pageSize: 6 }).then(({ ok, data }) => {
      if (ok && data.books?.length) setLatestBooks(data.books.slice(0, 6));
    });
  }, []);

  // Hero auto-rotate
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % featuredBooks.length), 4000);
    return () => clearInterval(t);
  }, [featuredBooks.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 3000); };

  const handleAddToCart = async (book) => {
    if (!user) { navigate('/login'); return; }
    const r = await addToCart(book.id, 1);
    showNotif(r.success ? `"${book.title}" added to cart!` : 'Failed to add to cart');
  };

  const heroBook = featuredBooks[heroIdx];

  return (
    <div className="home-container">
      {/* ── Notification ──────────────────────────────────────────────────── */}
      {notification && (
        <div style={{
          position:'fixed', top:'5rem', right:'1.5rem', zIndex:9999,
          background:'#8B0000', color:'#D4AF37',
          padding:'0.75rem 1.5rem', borderRadius:'10px',
          fontWeight:600, fontSize:'0.9rem',
          boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {notification}
        </div>
      )}

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor:'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logoImg} alt="Luxury Books Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          <span className="brand-text">LUXURY<span>BOOKS</span></span>
        </div>

        <div className="navbar-links">
          <Link to="/"       className="nav-link">Home</Link>
          <Link to="/books"  className="nav-link">Books</Link>
          <Link to="/cart"   className="nav-link">Cart</Link>
          <a href="#contact" className="nav-link">Contact</a>
          {user?.role === 'ADMIN' && <Link to="/admin" className="nav-link" style={{ color:'#D4AF37' }}>Admin</Link>}
        </div>

        <div className="navbar-actions">
          {/* Search */}
          <form onSubmit={handleSearch} className="navbar-search">
            <input
              id="hero-search"
              type="text"
              placeholder="Search books…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="navbar-search-input"
            />
            <button type="submit" className="navbar-search-btn">🔍</button>
          </form>

          {/* Cart */}
          <Link to="/cart" className="cart-icon-wrapper" style={{ textDecoration:'none', color:'inherit' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1.5"></circle>
              <circle cx="20" cy="21" r="1.5"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User avatar / Login */}
          {user ? (
            <div className="user-dropdown">
              <Link to="/profile" className="user-avatar-link">
                <div className="user-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                <span className="user-name">{user.name || user.email?.split('@')[0]}</span>
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <Link to="/login"    className="auth-btn login">Login</Link>
              <Link to="/register" className="auth-btn register">Register</Link>
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">{heroBook?.category}</span>
          <h1 className="hero-title">{heroBook?.title}</h1>
          <p className="hero-author">by {heroBook?.author}</p>
          <p className="hero-price">${Number(heroBook?.price || 0).toFixed(2)}</p>
          <div className="hero-actions">
            <Link to={`/books/${heroBook?.id}`} className="hero-btn-primary">View Details</Link>
            <button className="hero-btn-secondary" onClick={() => heroBook && handleAddToCart(heroBook)}>
              🛒 Add to Cart
            </button>
          </div>
        </div>
        <div className="hero-emoji">{heroBook?.image || '📚'}</div>
        <div className="hero-dots">
          {featuredBooks.map((_, i) => (
            <button key={i} className={`hero-dot ${i === heroIdx ? 'active' : ''}`} onClick={() => setHeroIdx(i)} />
          ))}
        </div>
      </section>

      {/* ── Category Menu ─────────────────────────────────────────────────── */}
      <section className="categories-section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/books?category=${cat.name}`}
              className="category-card"
              style={{ '--cat-color': cat.color }}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Books ─────────────────────────────────────────────────── */}
      <section className="books-section">
        <div className="section-header">
          <h2 className="section-title">Featured Books</h2>
          <Link to="/books" className="see-all-link">See All →</Link>
        </div>
        <div className="books-grid-home">
          {featuredBooks.map(book => (
            <div key={book.id} className="home-book-card">
              <div className="home-book-emoji">{book.image || '📖'}</div>
              <div className="home-book-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <div className="home-book-rating">
                  {'★'.repeat(Math.floor(book.rating || 0))}{'☆'.repeat(5-Math.floor(book.rating || 0))}
                </div>
                <span className="home-book-price">${Number(book.price).toFixed(2)}</span>
              </div>
              <div className="home-book-actions">
                <button className="home-add-cart" onClick={() => handleAddToCart(book)}>🛒 Add</button>
                <Link to={`/books/${book.id}`} className="home-view-btn">View</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ───────────────────────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="books-section">
          <div className="section-header">
            <h2 className="section-title">⭐ Best Sellers</h2>
            <Link to="/books?sortBy=rating_desc" className="see-all-link">See All →</Link>
          </div>
          <div className="books-grid-home">
            {bestSellers.map(book => (
              <div key={book.id} className="home-book-card bestseller">
                <div className="home-book-emoji">{book.image || '📖'}</div>
                <div className="home-book-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <div className="home-book-rating">
                    {'★'.repeat(Math.floor(book.rating || 0))}{'☆'.repeat(5-Math.floor(book.rating || 0))}
                  </div>
                  <span className="home-book-price">${Number(book.price).toFixed(2)}</span>
                </div>
                <div className="home-book-actions">
                  <button className="home-add-cart" onClick={() => handleAddToCart(book)}>🛒 Add</button>
                  <Link to={`/books/${book.id}`} className="home-view-btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Contact Section ────────────────────────────────────────────────── */}
      <section className="contact-section" id="contact">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>📚 Luxury Books</h3>
            <p>📍 132/1 Thalaiyadi Lane, Jaffna</p>
            <p>📞 (+94) 742-624-977</p>
            <p>✉️ hello@luxurybooks.com</p>
            <p>🕐 Mon–Sat: 9:00 AM – 8:00 PM</p>
          </div>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); showNotif('Message sent! We\'ll get back to you soon.'); }}>
            <input type="text"  placeholder="Your Name"    className="contact-input" required />
            <input type="email" placeholder="Your Email"   className="contact-input" required />
            <textarea           placeholder="Your Message" className="contact-input" rows={4} required></textarea>
            <button type="submit" className="contact-submit">Send Message</button>
          </form>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="home-footer">
        <div className="footer-brand">
          <span className="footer-logo">📚 Luxury Books</span>
          <p>Your premier destination for curated book collections.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
          <a href="#contact">Contact</a>
        </div>
        <p className="footer-copy">© 2024 Luxury Books. All rights reserved.</p>
      </footer>
    </div>
  );
}
