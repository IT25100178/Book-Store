// src/components/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sample books data with more details and images
  const books = [
    { 
      id: 1, 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      price: 14.99, 
      originalPrice: 24.99,
      rating: 4.5,
      category: 'Fiction',
      image: '📖',
      featuredImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
      description: 'A story of decadence and excess, Gatsby explores the darker aspects of the American Dream.',
      isNew: false,
      isBestseller: true,
      pages: 180,
      year: 1925
    },
    { 
      id: 2, 
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee', 
      price: 12.99, 
      originalPrice: 19.99,
      rating: 4.8,
      category: 'Classic',
      image: '📚',
      featuredImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&h=400&fit=crop',
      description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience.',
      isNew: false,
      isBestseller: true,
      pages: 336,
      year: 1960
    },
    { 
      id: 3, 
      title: '1984', 
      author: 'George Orwell', 
      price: 13.99, 
      originalPrice: 18.99,
      rating: 4.7,
      category: 'Dystopian',
      image: '📕',
      featuredImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop',
      description: 'A dystopian social science fiction novel and cautionary tale against unchecked government power.',
      isNew: true,
      isBestseller: false,
      pages: 328,
      year: 1949
    },
    { 
      id: 4, 
      title: 'Pride and Prejudice', 
      author: 'Jane Austen', 
      price: 11.99, 
      originalPrice: 16.99,
      rating: 4.6,
      category: 'Romance',
      image: '💕',
      featuredImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e86?w=600&h=400&fit=crop',
      description: 'A romantic novel that also contains a sharp critique of the British class system.',
      isNew: false,
      isBestseller: true,
      pages: 279,
      year: 1813
    },
    { 
      id: 5, 
      title: 'The Hobbit', 
      author: 'J.R.R. Tolkien', 
      price: 15.99, 
      originalPrice: 22.99,
      rating: 4.9,
      category: 'Fantasy',
      image: '🐉',
      featuredImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=600&h=400&fit=crop',
      description: 'A fantasy novel about the quest of home-loving hobbit Bilbo Baggins.',
      isNew: false,
      isBestseller: true,
      pages: 310,
      year: 1937
    },
    { 
      id: 6, 
      title: 'Harry Potter', 
      author: 'J.K. Rowling', 
      price: 19.99, 
      originalPrice: 29.99,
      rating: 4.9,
      category: 'Fantasy',
      image: '⚡',
      featuredImage: 'https://images.unsplash.com/photo-1600189261867-2e5c4b2d4b8f?w=600&h=400&fit=crop',
      description: 'The story of a young wizard and his adventures at Hogwarts School.',
      isNew: true,
      isBestseller: true,
      pages: 320,
      year: 1997
    },
    { 
      id: 7, 
      title: 'The Da Vinci Code', 
      author: 'Dan Brown', 
      price: 12.99, 
      originalPrice: 17.99,
      rating: 4.3,
      category: 'Mystery',
      image: '🔍',
      featuredImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop',
      description: 'A mystery thriller about a murder investigation in the Louvre Museum.',
      isNew: false,
      isBestseller: false,
      pages: 454,
      year: 2003
    },
    { 
      id: 8, 
      title: 'Becoming', 
      author: 'Michelle Obama', 
      price: 17.99, 
      originalPrice: 24.99,
      rating: 4.8,
      category: 'Biography',
      image: '👩',
      featuredImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
      description: 'The memoir of former First Lady of the United States.',
      isNew: true,
      isBestseller: true,
      pages: 448,
      year: 2018
    }
  ];

  const categories = ['All', 'Fiction', 'Classic', 'Dystopian', 'Romance', 'Fantasy', 'Mystery', 'Biography'];

  // Auto-rotate featured books
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % books.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (book) => {
    const existingItem = cartItems.find(item => item.id === book.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...book, quantity: 1 }]);
    }
    setCartCount(cartCount + 1);
    
    setNotificationMessage(`${book.title} added to cart!`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeFromCart = (id) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(cartItems.filter(item => item.id !== id));
    setCartCount(cartCount - (item?.quantity || 1));
    
    setNotificationMessage(`Item removed from cart`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
    const oldItem = cartItems.find(item => item.id === id);
    const diff = newQuantity - oldItem.quantity;
    setCartCount(cartCount + diff);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getCartSavings = () => {
    const originalTotal = cartItems.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
    const currentTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return (originalTotal - currentTotal).toFixed(2);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star star-filled">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star star-half">★</span>);
      } else {
        stars.push(<span key={i} className="star star-empty">★</span>);
      }
    }
    return stars;
  };

  const goToPrevious = () => {
    setFeaturedIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  const goToNext = () => {
    setFeaturedIndex((prev) => (prev + 1) % books.length);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="home-container">
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Notification Toast */}
      {showNotification && (
        <div className="notification-toast animate-slide-in">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar animate-slide-down">
        <div className="navbar-brand">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="brand-text">LUXURY<span>BOOKS</span></span>
        </div>

        {/* Navigation Menu */}
        <div className="navbar-menu">
          <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </button>
          <button className={`nav-link ${location.pathname === '/books' ? 'active' : ''}`} onClick={() => navigate('/books')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            Book List
          </button>
        </div>

        <div className="navbar-actions">
          <div className="cart-icon-wrapper" onClick={() => setShowCart(!showCart)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1.5"></circle>
              <circle cx="20" cy="21" r="1.5"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span className="cart-badge animate-pulse">
                {cartCount}
              </span>
            )}
          </div>

          <div className="user-dropdown">
            <div className="user-avatar">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <span className="user-name">
              {user?.name || user?.email?.split('@')[0] || 'Reader'}
            </span>
            <button onClick={logout} className="logout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l4-4-4-4M20 13H9" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <>
          <div className="cart-overlay" onClick={() => setShowCart(false)}></div>
          <div className="cart-sidebar animate-slide-left">
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <button className="cart-close" onClick={() => setShowCart(false)}>×</button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="21" r="1.5" stroke="currentColor"/>
                  <circle cx="20" cy="21" r="1.5" stroke="currentColor"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor"/>
                </svg>
                <p>Your cart is empty</p>
                <button className="continue-shopping" onClick={() => setShowCart(false)}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item animate-fade-in">
                      <div className="cart-item-image">{item.image}</div>
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p className="cart-item-author">{item.author}</p>
                        <div className="cart-item-price">
                          <span className="current-price">${item.price}</span>
                          <span className="original-price">${item.originalPrice}</span>
                        </div>
                        <div className="cart-item-quantity">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-footer">
                  <div className="cart-savings">
                    <span>You saved</span>
                    <span className="savings-amount">${getCartSavings()}</span>
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <span className="total-amount">${getCartTotal()}</span>
                  </div>
                  <button className="checkout-btn">
                    Proceed to Checkout
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content animate-scale-in">
          <div className="hero-badge">Premium Collection</div>
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">Luxury Books</span>
          </h1>
          <p className="hero-subtitle">
            Discover your next favorite book from our curated collection of masterpieces
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Books</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Authors</span>
            </div>
            <div className="stat">
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Happy Readers</span>
            </div>
          </div>
          <button className="explore-btn" onClick={() => document.getElementById('books-section').scrollIntoView({ behavior: 'smooth' })}>
            Explore Collection
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Featured Books Slider with Images */}
      <div className="featured-section">
        <div className="section-header">
          <h2>Featured <span className="gradient-text">Bestsellers</span></h2>
          <p>Hand-picked just for you</p>
        </div>
        
        <div className="featured-slider-container">
          <button className="slider-nav prev" onClick={goToPrevious}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <div className="featured-slider">
            <div 
              className="featured-slide" 
              style={{ 
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%), url(${books[featuredIndex].featuredImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="featured-content">
                <div className="featured-badge">
                  {books[featuredIndex].isBestseller ? '⭐ BESTSELLER ⭐' : '📚 FEATURED 📚'}
                </div>
                <h3>{books[featuredIndex].title}</h3>
                <p className="featured-author">by {books[featuredIndex].author}</p>
                <div className="featured-rating">{renderStars(books[featuredIndex].rating)}</div>
                <p className="featured-description">{books[featuredIndex].description}</p>
                <div className="featured-meta">
                  <span className="featured-year">📅 {books[featuredIndex].year}</span>
                  <span className="featured-pages">📖 {books[featuredIndex].pages} pages</span>
                </div>
                <div className="featured-price-section">
                  <span className="featured-price">${books[featuredIndex].price}</span>
                  <span className="featured-original-price">${books[featuredIndex].originalPrice}</span>
                  <span className="featured-discount">
                    Save ${(books[featuredIndex].originalPrice - books[featuredIndex].price).toFixed(2)}
                  </span>
                </div>
                <button className="featured-btn" onClick={() => addToCart(books[featuredIndex])}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" strokeWidth="1.5"/>
                  </svg>
                  Shop Now
                </button>
              </div>
              <div className="featured-emoji">{books[featuredIndex].image}</div>
            </div>
          </div>
          
          <button className="slider-nav next" onClick={goToNext}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        <div className="carousel-dots">
          {books.map((_, idx) => (
            <button 
              key={idx} 
              className={`dot ${idx === featuredIndex ? 'active' : ''}`}
              onClick={() => setFeaturedIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div id="books-section" className="main-content">
        {/* Search and Filter Bar */}
        <div className="search-filter-section">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L17 17" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>Found <span className="highlight">{filteredBooks.length}</span> {filteredBooks.length === 1 ? 'book' : 'books'}</p>
        </div>

        {/* Books Grid */}
        <div className="books-grid">
          {filteredBooks.map((book, index) => (
            <div key={book.id} className="book-card animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              {book.isNew && <div className="book-badge new">New</div>}
              {book.isBestseller && !book.isNew && <div className="book-badge bestseller">Bestseller</div>}
              <div className="book-emoji">{book.image}</div>
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <div className="book-rating">
                {renderStars(book.rating)}
                <span className="rating-count">({book.rating})</span>
              </div>
              <p className="book-description">{book.description.substring(0, 80)}...</p>
              <div className="book-footer">
                <div className="book-price">
                  <span className="current-price">${book.price}</span>
                  <span className="original-price">${book.originalPrice}</span>
                </div>
                <button
                  onClick={() => addToCart(book)}
                  className="add-to-cart-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="no-results">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M21 21L17 17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <h3>No books found</h3>
            <p>Try adjusting your search or filter to find what you're looking for</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2>Why Choose <span className="gradient-text">Luxury Books</span></h2>
          <p>Experience the difference</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3>Free Premium Shipping</h3>
            <p>On all orders over $50</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>24/7 Concierge Support</h3>
            <p>Luxury customer service</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Secure Luxury Payment</h3>
            <p>100% secure transactions</p>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h2>Join the <span className="gradient-text">Luxury Circle</span></h2>
          <p>Get exclusive access to new releases, author events, and special offers</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>LUXURY<span>BOOKS</span></h3>
            <p>Your premier destination for luxury reading experiences</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>📍 132/1 Thalaiyadi Lane, Jaffna</li>
              <li>📞 (+94) 742-624-977</li>
              <li>✉️ hello@luxurybooks.com</li>
              <li>S.Athethan</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Luxury Books. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}