// src/pages/BookDetailPage.jsx
// Page 1: Book Detail — shows full book info, description, author, price, availability, rating, reviews
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BOOKS_DATA } from '../data/booksData';
import { BookHashMap, RecentlyViewedStack, BreadcrumbList, WaitlistQueue } from '../dsa/structures';
import BookImage from '../components/BookImage';
import Navbar from '../components/Navbar';
import '../styles/BookDetailPage.css';

// OOP: BookInfo base class (abstract)
class BookInfo {
  constructor(data) {
    this._isbn = data.isbn;
    this._title = data.title;
    this._description = data.description;
    this._authorId = data.authorId;
  }
  get isbn() { return this._isbn; }
  get title() { return this._title; }
  get description() { return this._description; }
  displayBookInfo() { throw new Error('Abstract method'); }
  displayDescription() { throw new Error('Abstract method'); }
}

// OOP: BookStore extends BookInfo (your component)
class BookStoreItem extends BookInfo {
  constructor(data) {
    super(data);
    this._price = data.price;
    this._originalPrice = data.originalPrice;
    this._memberPrice = data.memberPrice;
    this._availability = data.availability;
    this._stock = data.stock;
    this._publisher = data.publisher;
    this._rating = data.rating;
    this._recommendedIds = data.recommendedIds;
  }
  get price() { return this._price; }
  get originalPrice() { return this._originalPrice; }
  get memberPrice() { return this._memberPrice; }
  get availability() { return this._availability; }
  get stock() { return this._stock; }
  get publisher() { return this._publisher; }
  get rating() { return this._rating; }

  displayBookInfo() {
    return `${this._title} (ISBN: ${this._isbn})`;
  }
  displayDescription() {
    return this._description;
  }
  displayPrice(isMember = false) {
    return isMember ? `$${this._memberPrice.toFixed(2)}` : `$${this._price.toFixed(2)}`;
  }
  displayAvailability() {
    const map = { 'IN_STOCK': '✅ In Stock', 'OUT_OF_STOCK': '❌ Out of Stock', 'PRE_ORDER': '📦 Pre-Order' };
    return map[this._availability] || this._availability;
  }
  getDiscount() {
    return Math.round(((this._originalPrice - this._price) / this._originalPrice) * 100);
  }
}

// DSA: Initialize HashMap cache
const bookCache = new BookHashMap();
BOOKS_DATA.forEach(b => bookCache.put(b.id, b));

// DSA: Recently viewed stack
const recentlyViewed = new RecentlyViewedStack();

// DSA: Waitlist queues per book
const waitlists = {};

export default function BookDetailPage({ cartItems = [], setCartItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookId = parseInt(id);

  // DSA: HashMap lookup O(1)
  const rawBook = bookCache.get(bookId);
  
  const [isMember, setIsMember] = useState(false);
  const [waitlistMsg, setWaitlistMsg] = useState('');

  // DSA: Track recently viewed
  useEffect(() => {
    if (rawBook) {
      recentlyViewed.push(bookId);
    }
  }, [bookId, rawBook]);

  // OOP: Create BookStoreItem instance
  const book = useMemo(() => {
    if (!rawBook) return null;
    return new BookStoreItem(rawBook);
  }, [rawBook]);

  // DSA: LinkedList breadcrumbs
  const breadcrumbs = useMemo(() => {
    const list = new BreadcrumbList();
    list.append('Home', '/');
    list.append('Books', '/books');
    if (rawBook) {
      list.append(rawBook.category, '/books');
      list.append(rawBook.title, null);
    }
    return list.toArray();
  }, [rawBook]);

  // Get recommended books using HashMap
  const recommended = useMemo(() => {
    if (!rawBook || !rawBook.recommendedIds) return [];
    return rawBook.recommendedIds.map(rid => bookCache.get(rid)).filter(Boolean);
  }, [rawBook]);

  // Get author's other books
  const authorBooks = useMemo(() => {
    if (!rawBook) return [];
    return BOOKS_DATA.filter(b => b.authorId === rawBook.authorId && b.id !== rawBook.id);
  }, [rawBook]);

  const handleJoinWaitlist = () => {
    if (!waitlists[bookId]) waitlists[bookId] = new WaitlistQueue();
    const userId = 'user-' + Math.floor(Math.random() * 10000);
    const pos = waitlists[bookId].enqueue(userId);
    setWaitlistMsg(`You joined the waitlist at position #${pos}`);
  };

  const handleAddToCart = () => {
    if (!setCartItems) return;
    const existingItem = cartItems.find(item => item.id === rawBook.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === rawBook.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...rawBook, quantity: 1 }]);
    }
    setWaitlistMsg('🎉 Added to cart!');
    setTimeout(() => setWaitlistMsg(''), 3000);
  };

  if (!rawBook || !book) {
    return (
      <div className="bd-error">
        <h2>Book not found</h2>
        <Link to="/" className="bd-back-link">← Back to Home</Link>
      </div>
    );
  }

  const discount = book.getDiscount();

  return (
    <>
      <Navbar cartItems={cartItems} setCartItems={setCartItems} />
      <div className="bd-page" style={{ marginTop: '70px' }}>
      <div className="bd-container">
        {/* Breadcrumbs using LinkedList */}
        <nav className="bd-breadcrumbs">
          {breadcrumbs.map((bc, idx) => (
            <span key={idx}>
              {bc.path ? (
                <Link to={bc.path} className="bd-crumb-link">{bc.label}</Link>
              ) : (
                <span className="bd-crumb-current">{bc.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && <span className="bd-crumb-sep">›</span>}
            </span>
          ))}
        </nav>

        <div className="bd-main">
          {/* Book Image */}
          <div className="bd-image-section">
            <BookImage image={rawBook.image} featuredImage={rawBook.featuredImage} title={rawBook.title} />
          </div>

          {/* Book Info */}
          <div className="bd-info-section">
            <div className="bd-badges">
              {rawBook.isNew && <span className="bd-badge bd-badge-new">New</span>}
              {rawBook.isBestseller && <span className="bd-badge bd-badge-best">Bestseller</span>}
              {discount > 0 && <span className="bd-badge bd-badge-discount">-{discount}%</span>}
            </div>

            <h1 className="bd-title">{rawBook.title}</h1>
            <p className="bd-author-link">
              by <Link to={`/author/${rawBook.authorId}`}>{rawBook.author}</Link>
            </p>

            {/* Rating */}
            <div className="bd-rating">
              <div className="bd-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.floor(rawBook.rating) ? 'bd-star filled' : 'bd-star'}>★</span>
                ))}
              </div>
              <span className="bd-rating-text">
                {rawBook.rating} · <Link to={`/reviews/${rawBook.id}`}>{rawBook.reviews.length} reviews</Link>
              </span>
            </div>

            {/* Price (Polymorphic: member vs guest) */}
            <div className="bd-price-box">
              <div className="bd-price-row">
                <span className="bd-price-current">{book.displayPrice(isMember)}</span>
                <span className="bd-price-original">${rawBook.originalPrice.toFixed(2)}</span>
                {isMember && <span className="bd-member-tag">Member Price</span>}
              </div>
              <button className="bd-member-toggle" onClick={() => setIsMember(!isMember)}>
                {isMember ? '👑 Viewing as Member' : 'See Member Price'}
              </button>
            </div>

            {/* Availability */}
            <div className="bd-availability">
              <span className={`bd-avail-status ${rawBook.availability.toLowerCase().replace('_', '-')}`}>
                {book.displayAvailability()}
              </span>
              {rawBook.stock > 0 && <span className="bd-stock-count">({rawBook.stock} left)</span>}
            </div>

            {/* Action Buttons */}
            <div className="bd-actions">
              {rawBook.availability === 'IN_STOCK' ? (
                <button className="bd-btn-cart" onClick={handleAddToCart}>🛒 Add to Cart</button>
              ) : (
                <button className="bd-btn-waitlist" onClick={handleJoinWaitlist}>
                  ⏳ Join Waitlist
                </button>
              )}
              <Link to={`/reviews/${rawBook.id}`} className="bd-btn-reviews">
                ✍️ Write a Review
              </Link>
            </div>
            {waitlistMsg && <p className="bd-waitlist-msg">{waitlistMsg}</p>}

            {/* Book Meta */}
            <div className="bd-meta-grid">
              <div className="bd-meta-item"><strong>Publisher</strong><span>{rawBook.publisher}</span></div>
              <div className="bd-meta-item"><strong>ISBN</strong><span>{rawBook.isbn}</span></div>
              <div className="bd-meta-item"><strong>Pages</strong><span>{rawBook.pages}</span></div>
              <div className="bd-meta-item"><strong>Year</strong><span>{rawBook.year}</span></div>
              <div className="bd-meta-item"><strong>Language</strong><span>{rawBook.language}</span></div>
              <div className="bd-meta-item"><strong>Category</strong><span>{rawBook.category}</span></div>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="bd-section">
          <h2>📖 Description</h2>
          <p className="bd-description">{book.displayDescription()}</p>
        </section>

        {/* Author Preview */}
        <section className="bd-section bd-author-section">
          <h2>✍️ About the Author</h2>
          <div className="bd-author-card">
            <img src={rawBook.authorDetails.photo} alt={rawBook.author} className="bd-author-photo" />
            <div className="bd-author-info">
              <h3>{rawBook.author}</h3>
              <p className="bd-author-bio">{rawBook.authorDetails.bio}</p>
              <div className="bd-author-meta">
                <span>🌍 {rawBook.authorDetails.nationality}</span>
                <span>🎂 {rawBook.authorDetails.birthDate}</span>
              </div>
              <Link to={`/author/${rawBook.authorId}`} className="bd-author-link-btn">
                View Full Author Profile →
              </Link>
            </div>
          </div>
        </section>

        {/* Reviews Preview */}
        <section className="bd-section">
          <div className="bd-section-header">
            <h2>⭐ Customer Reviews ({rawBook.reviews.length})</h2>
            <Link to={`/reviews/${rawBook.id}`} className="bd-see-all">See All Reviews →</Link>
          </div>
          <div className="bd-reviews-preview">
            {rawBook.reviews.slice(0, 3).map(review => (
              <div key={review.id} className="bd-review-card">
                <div className="bd-review-header">
                  <span className="bd-review-user">{review.user}</span>
                  <div className="bd-review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'bd-star filled' : 'bd-star'}>★</span>
                    ))}
                  </div>
                </div>
                <p className="bd-review-comment">{review.comment}</p>
                <div className="bd-review-footer">
                  <span className="bd-review-date">{review.date}</span>
                  <span className="bd-review-helpful">👍 {review.helpfulVotes}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Books */}
        {recommended.length > 0 && (
          <section className="bd-section">
            <h2>📚 You May Also Like</h2>
            <div className="bd-recommended-grid">
              {recommended.map(rec => (
                <Link key={rec.id} to={`/book/${rec.id}`} className="bd-rec-card">
                  <BookImage image={rec.image} featuredImage={rec.featuredImage} title={rec.title} />
                  <div className="bd-rec-info">
                    <h4>{rec.title}</h4>
                    <p>by {rec.author}</p>
                    <span className="bd-rec-price">${rec.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Author's Other Books */}
        {authorBooks.length > 0 && (
          <section className="bd-section">
            <h2>📖 More by {rawBook.author}</h2>
            <div className="bd-recommended-grid">
              {authorBooks.map(ab => (
                <Link key={ab.id} to={`/book/${ab.id}`} className="bd-rec-card">
                  <BookImage image={ab.image} featuredImage={ab.featuredImage} title={ab.title} />
                  <div className="bd-rec-info">
                    <h4>{ab.title}</h4>
                    <span className="bd-rec-price">${ab.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed (Stack DSA) */}
        {recentlyViewed.getAll().length > 1 && (
          <section className="bd-section">
            <h2>🕐 Recently Viewed</h2>
            <div className="bd-recommended-grid">
              {recentlyViewed.getAll()
                .filter(rid => rid !== bookId)
                .slice(0, 4)
                .map(rid => {
                  const rb = bookCache.get(rid);
                  if (!rb) return null;
                  return (
                    <Link key={rb.id} to={`/book/${rb.id}`} className="bd-rec-card">
                      <BookImage image={rb.image} featuredImage={rb.featuredImage} title={rb.title} />
                      <div className="bd-rec-info">
                        <h4>{rb.title}</h4>
                        <p>by {rb.author}</p>
                        <span className="bd-rec-price">${rb.price.toFixed(2)}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
    </>
  );
}
