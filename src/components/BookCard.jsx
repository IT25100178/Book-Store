// src/components/BookCard.jsx
import { Link } from 'react-router-dom';
import BookImage from './BookImage';
import './BookCard.css';

export default function BookCard({ book, onAddToCart }) {
  const discountPercentage = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(book);
    }
  };

  return (
    <div className="book-card">
      {/* Badge Badges */}
      <div className="book-card-badges">
        {book.isNew && <span className="badge badge-new">New</span>}
        {book.isBestseller && <span className="badge badge-bestseller">Bestseller</span>}
        {discountPercentage > 0 && (
          <span className="badge badge-discount">-{discountPercentage}%</span>
        )}
      </div>

      {/* Book Image */}
      <div className="book-card-image">
        <BookImage
          image={book.image}
          featuredImage={book.featuredImage}
          title={book.title}
        />
      </div>

      {/* Book Info */}
      <div className="book-card-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>

        {/* Rating */}
        <div className="book-rating">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.floor(book.rating) ? 'star filled' : 'star'}>
                ★
              </span>
            ))}
          </div>
          <span className="rating-value">({book.rating})</span>
        </div>

        {/* Category & Pages */}
        <div className="book-meta">
          <span className="category">{book.category}</span>
          <span className="pages">{book.pages} pages</span>
        </div>

        {/* Price */}
        <div className="book-price">
          <span className="price">${book.price.toFixed(2)}</span>
          {book.originalPrice > book.price && (
            <span className="original-price">${book.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Description */}
        <p className="book-description">{book.description}</p>

        {/* Buttons */}
        <div className="book-card-buttons">
          <button className="btn-add-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <Link to={`/book/${book.id}`} className="btn-view-details">
            View Details
          </Link>
          <button className="btn-wishlist">♡</button>
        </div>
      </div>
    </div>
  );
}
