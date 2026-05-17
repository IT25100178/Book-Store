// src/pages/ReviewsPage.jsx
// Page 3: Reviews & Ratings — view, post, sort reviews
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BOOKS_DATA } from '../data/booksData';
import { BookHashMap, mergeSort } from '../dsa/structures';
import Navbar from '../components/Navbar';
import '../styles/ReviewsPage.css';

const bookCache = new BookHashMap();
BOOKS_DATA.forEach(b => bookCache.put(b.id, b));

export default function ReviewsPage({ cartItems, setCartItems }) {
  const { id } = useParams();
  const bookId = parseInt(id);
  const book = bookCache.get(bookId);

  const [reviews, setReviews] = useState(book ? [...book.reviews] : []);
  const [sortBy, setSortBy] = useState('date');
  const [newReview, setNewReview] = useState({ user: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);

  // DSA: Merge Sort reviews
  const sortedReviews = useMemo(() => {
    const comparators = {
      date: (a, b) => new Date(b.date) - new Date(a.date),
      rating_high: (a, b) => b.rating - a.rating,
      rating_low: (a, b) => a.rating - b.rating,
      helpful: (a, b) => b.helpfulVotes - a.helpfulVotes,
    };
    return mergeSort([...reviews], comparators[sortBy] || comparators.date);
  }, [reviews, sortBy]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.user.trim() || !newReview.comment.trim()) return;
    const review = {
      id: 'r-' + Date.now(),
      user: newReview.user,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpfulVotes: 0
    };
    setReviews([review, ...reviews]);
    setNewReview({ user: '', rating: 5, comment: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (!book) {
    return <div className="rp-error"><h2>Book not found</h2><Link to="/">← Home</Link></div>;
  }

  return (
    <>
      <Navbar cartItems={cartItems} setCartItems={setCartItems} />
      <div className="rp-page" style={{ marginTop: '70px' }}>
      <div className="rp-container">
        <Link to={`/book/${bookId}`} className="rp-back">← Back to {book.title}</Link>

        <div className="rp-header">
          <h1>Reviews for "{book.title}"</h1>
          <p className="rp-subtitle">by {book.author}</p>
        </div>

        {/* Rating Summary */}
        <div className="rp-summary">
          <div className="rp-avg">
            <span className="rp-avg-number">{avgRating}</span>
            <div className="rp-avg-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.round(avgRating) ? 'rp-star filled' : 'rp-star'}>★</span>
              ))}
            </div>
            <span className="rp-total">{reviews.length} reviews</span>
          </div>
          <div className="rp-distribution">
            {ratingDist.map(d => (
              <div key={d.star} className="rp-dist-row">
                <span className="rp-dist-label">{d.star}★</span>
                <div className="rp-dist-bar"><div className="rp-dist-fill" style={{ width: `${d.pct}%` }}></div></div>
                <span className="rp-dist-count">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Post Review Form */}
        <div className="rp-form-section">
          <h2>✍️ Write a Review</h2>
          {submitted && <div className="rp-success">✅ Review submitted successfully!</div>}
          <form onSubmit={handleSubmit} className="rp-form">
            <div className="rp-form-row">
              <label>Your Name</label>
              <input type="text" value={newReview.user} onChange={e => setNewReview({...newReview, user: e.target.value})} placeholder="Enter your name" required />
            </div>
            <div className="rp-form-row">
              <label>Rating</label>
              <div className="rp-rating-select">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" className={`rp-rate-btn ${newReview.rating >= s ? 'active' : ''}`} onClick={() => setNewReview({...newReview, rating: s})}>★</button>
                ))}
              </div>
            </div>
            <div className="rp-form-row">
              <label>Your Review</label>
              <textarea value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} placeholder="Share your thoughts about this book..." rows="4" required />
            </div>
            <button type="submit" className="rp-submit-btn">Submit Review</button>
          </form>
        </div>

        {/* Sort Controls */}
        <div className="rp-sort-bar">
          <h2>All Reviews ({reviews.length})</h2>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rp-sort-select">
            <option value="date">Most Recent</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Reviews List (sorted via MergeSort) */}
        <div className="rp-reviews-list">
          {sortedReviews.map(review => (
            <div key={review.id} className="rp-review-card">
              <div className="rp-review-top">
                <div className="rp-review-user-info">
                  <div className="rp-review-avatar">{review.user.charAt(0)}</div>
                  <div>
                    <span className="rp-review-name">{review.user}</span>
                    <span className="rp-review-date">{review.date}</span>
                  </div>
                </div>
                <div className="rp-review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? 'rp-star filled' : 'rp-star'}>★</span>
                  ))}
                </div>
              </div>
              <p className="rp-review-text">{review.comment}</p>
              <div className="rp-review-bottom">
                <span className="rp-helpful">👍 {review.helpfulVotes} found this helpful</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
