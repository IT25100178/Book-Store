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
    </div>
  );
}
