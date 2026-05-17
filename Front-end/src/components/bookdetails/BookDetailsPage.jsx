// src/components/bookdetails/BookDetailsPage.jsx
// Member 3 – Yuvaniya
// Fetches a single book and its reviews from the Java backend
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { books as booksApi } from '../../services/api';
import './BookDetailsPage.css';

export default function BookDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [book,      setBook]      = useState(null);
  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity,  setQuantity]  = useState(1);

  // ── New review form ───────────────────────────────────────────────────────
  const [reviewRating,  setReviewRating]  = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg,     setReviewMsg]     = useState('');
  const [submitting,    setSubmitting]    = useState(false);

  // ── Cart feedback ─────────────────────────────────────────────────────────
  const [cartMsg, setCartMsg] = useState('');

  // ── Fetch book + reviews ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [bookRes, reviewRes] = await Promise.all([
        booksApi.getById(id),
        booksApi.getReviews(id),
      ]);
      if (bookRes.ok) setBook(bookRes.data);
      if (reviewRes.ok) setReviews(Array.isArray(reviewRes.data) ? reviewRes.data : []);
      setLoading(false);
    }
    load();
  }, [id]);

  // ── Add to cart ───────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    const result = await addToCart(book.id, quantity);
    setCartMsg(result.success ? '✓ Added to cart!' : (result.error || 'Failed'));
    setTimeout(() => setCartMsg(''), 3000);
  };

  // ── Submit review ─────────────────────────────────────────────────────────
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    const { ok, data } = await booksApi.addReview(id, {
      userId:   user.id,
      userName: user.name || user.email,
      rating:   reviewRating,
      comment:  reviewComment,
    });
    if (ok) {
      setReviewMsg('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      // Refresh reviews
      const res = await booksApi.getReviews(id);
      if (res.ok) setReviews(Array.isArray(res.data) ? res.data : []);
    } else {
      setReviewMsg(data?.message || 'Submission failed');
    }
    setSubmitting(false);
    setTimeout(() => setReviewMsg(''), 3000);
  };

  // ── Average rating ────────────────────────────────────────────────────────
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : (book?.rating ?? 0).toFixed(1);

  if (loading) {
    return (
      <div className="book-details-loading">
        <div className="details-spinner">📖</div>
        <p>Loading book details…</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-not-found">
        <h2>Book not found</h2>
        <Link to="/books">← Back to Catalogue</Link>
      </div>
    );
  }

  const discount = book.originalPrice > book.price
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  return (
    <div className="book-details-page">

      {/* ── Back Link ──────────────────────────────────────────────────────── */}
      <div className="details-breadcrumb">
        <Link to="/">Home</Link> ›
        <Link to="/books">Books</Link> ›
        <span>{book.title}</span>
      </div>

      {/* ── Main Section ────────────────────────────────────────────────────── */}
      <div className="details-hero">

        {/* Left – Book Cover */}
        <div className="details-cover">
          <div className="details-cover-inner">
            <div className="details-emoji">{book.image || '📖'}</div>
          </div>
          {book.isNew        && <span className="det-badge new">New</span>}
          {book.isBestseller && <span className="det-badge best">Bestseller</span>}
          {discount > 0      && <span className="det-badge disc">-{discount}%</span>}
        </div>

        {/* Right – Info */}
        <div className="details-info">
          <span className="details-category">{book.category}</span>
          <h1 className="details-title">{book.title}</h1>
          <p className="details-author">by <strong>{book.author}</strong></p>

          {/* Rating */}
          <div className="details-rating">
            <div className="det-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(avgRating) ? 'star filled' : 'star'}>★</span>
              ))}
            </div>
            <span className="det-avg">{avgRating}</span>
            <span className="det-rev-count">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
          </div>

          {/* Price */}
          <div className="details-price">
            <span className="det-price">${Number(book.price).toFixed(2)}</span>
            {book.originalPrice > book.price && (
              <span className="det-orig">${Number(book.originalPrice).toFixed(2)}</span>
            )}
          </div>

          {/* Meta */}
          <div className="details-meta-grid">
            {[
              { label: 'Pages',    value: book.pages },
              { label: 'Year',     value: book.year  },
              { label: 'Category', value: book.category },
              { label: 'Stock',    value: book.stock > 0 ? `${book.stock} available` : 'Out of stock' },
            ].map(({ label, value }) => (
              <div key={label} className="det-meta-item">
                <span className="det-meta-label">{label}</span>
                <span className="det-meta-value">{value}</span>
              </div>
            ))}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="details-actions">
            <div className="det-qty">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(book.stock || 99, q + 1))}>+</button>
            </div>
            <button
              id="add-to-cart-details-btn"
              className="det-add-cart"
              onClick={handleAddToCart}
              disabled={book.stock === 0}
            >
              {book.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
            <Link to="/cart" className="det-view-cart">View Cart</Link>
          </div>

          {cartMsg && <p className="det-cart-msg">{cartMsg}</p>}
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="details-tabs">
        {['description','author','reviews'].map(tab => (
          <button
            key={tab}
            className={`det-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'reviews' && ` (${reviews.length})`}
          </button>
        ))}
      </div>

      <div className="details-tab-content">

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="det-description">
            <p>{book.description}</p>
          </div>
        )}

        {/* Author Tab */}
        {activeTab === 'author' && (
          <div className="det-author-section">
            <div className="det-author-avatar">{book.author?.charAt(0)}</div>
            <div>
              <h3>{book.author}</h3>
              <p className="det-author-bio">
                {book.author} is a renowned author whose work "{book.title}" has captured readers worldwide.
                Published in {book.year}, this {book.category} classic continues to inspire generations.
              </p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="det-reviews-section">

            {/* Existing reviews */}
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((r, i) => (
                  <div key={r.id || i} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">{(r.userName || r.userId || 'U').charAt(0).toUpperCase()}</div>
                      <div>
                        <strong className="reviewer-name">{r.userName || 'Anonymous'}</strong>
                        <div className="review-stars">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <span key={j} className={j < r.rating ? 'star filled' : 'star'}>★</span>
                          ))}
                        </div>
                      </div>
                      <span className="review-date">{r.date}</span>
                    </div>
                    <p className="review-comment">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add review form */}
            {user && (
              <form className="add-review-form" onSubmit={handleSubmitReview}>
                <h4>Write a Review</h4>
                <div className="star-select">
                  {[1,2,3,4,5].map(n => (
                    <button type="button" key={n}
                      className={n <= reviewRating ? 'star-btn filled' : 'star-btn'}
                      onClick={() => setReviewRating(n)}>★</button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your thoughts about this book…"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows={4}
                />
                {reviewMsg && <p className="review-msg">{reviewMsg}</p>}
                <button type="submit" className="submit-review-btn" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
