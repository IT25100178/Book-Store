// src/components/books/BookCard.jsx
// Member 2 – Deepika
// Fixed: corrected import paths + link to /books/:id
import { Link } from 'react-router-dom';
import BookImage from './BookImage';
import './BookCard.css';

export default function BookCard({ book, onAddToCart }) {
  const discountPercentage = book.originalPrice > book.price
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="book-card">
      <div className="book-card-badges">
        {book.isNew        && <span className="badge badge-new">New</span>}
        {book.isBestseller && <span className="badge badge-bestseller">Bestseller</span>}
        {discountPercentage > 0 && (
          <span className="badge badge-discount">-{discountPercentage}%</span>
        )}
      </div>

      <div className="book-card-image">
        <BookImage
          image={book.image}
          featuredImage={book.featuredImage}
          title={book.title}
        />
      </div>

      <div className="book-card-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>

        <div className="book-rating">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.floor(book.rating) ? 'star filled' : 'star'}>★</span>
            ))}
          </div>
          <span className="rating-value">({book.rating})</span>
        </div>

        <div className="book-meta">
          <span className="category">{book.category}</span>
          <span className="pages">{book.pages} pages</span>
        </div>

        <div className="book-price">
          <span className="price">${Number(book.price).toFixed(2)}</span>
          {book.originalPrice > book.price && (
            <span className="original-price">${Number(book.originalPrice).toFixed(2)}</span>
          )}
        </div>

        <p className="book-description">{book.description}</p>

        <div className="book-card-buttons">
          <button
            id={`add-to-cart-${book.id}`}
            className="btn-add-cart"
            onClick={() => onAddToCart && onAddToCart(book)}
          >
            Add to Cart
          </button>
          <Link to={`/books/${book.id}`} className="btn-view-details">
            View Details
          </Link>
          <button className="btn-wishlist" aria-label="Add to wishlist">♡</button>
        </div>
      </div>
    </div>
  );
}
