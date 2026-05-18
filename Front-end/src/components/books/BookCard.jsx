import { Link } from 'react-router-dom';
import BookImage from './BookImage';
import './BookCard.css';

export default function BookCard({ book, onAddToCart }) {
  const discountPercentage = book.originalPrice > book.price
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="glass-card modern-book-card">
      <div className="modern-book-badges">
        {book.isNew && <span className="modern-badge badge-new">New</span>}
        {book.isBestseller && <span className="modern-badge badge-bestseller">Bestseller</span>}
        {discountPercentage > 0 && (
          <span className="modern-badge badge-discount">-{discountPercentage}%</span>
        )}
      </div>

      <div className="modern-book-image-wrapper">
        <BookImage
          image={book.image}
          featuredImage={book.featuredImage}
          title={book.title}
        />
        <div className="modern-book-overlay">
          <button className="modern-wishlist-btn" aria-label="Add to wishlist">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="modern-book-content">
        <div className="modern-book-meta">
          <span className="modern-book-category">{book.category}</span>
          <div className="modern-book-rating">
            <span className="star filled">★</span>
            <span className="rating-text">{Number(book.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <h3 className="modern-book-title" title={book.title}>{book.title}</h3>
        <p className="modern-book-author">by {book.author}</p>

        <div className="modern-book-price-row">
          <div className="price-container">
            <span className="current-price">${Number(book.price).toFixed(2)}</span>
            {book.originalPrice > book.price && (
              <span className="original-price">${Number(book.originalPrice).toFixed(2)}</span>
            )}
          </div>
        </div>

        <div className="modern-book-actions">
          <Link to={`/books/${book.id}`} className="btn-modern-view">View Details</Link>
          <button
            id={`add-to-cart-${book.id}`}
            className="btn-modern-cart"
            onClick={() => onAddToCart && onAddToCart(book)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
