// src/pages/AuthorPage.jsx
// Page 2: Author Profile — bio, details, and all books by this author
import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BOOKS_DATA } from '../data/booksData';
import { BookHashMap, mergeSort } from '../dsa/structures';
import BookImage from '../components/BookImage';
import Navbar from '../components/Navbar';
import '../styles/AuthorPage.css';

// DSA: Build an author HashMap for O(1) lookup
const authorMap = new BookHashMap();
BOOKS_DATA.forEach(b => {
  if (!authorMap.has(b.authorId)) {
    authorMap.put(b.authorId, { ...b.authorDetails, id: b.authorId, name: b.author });
  }
});

export default function AuthorPage({ cartItems, setCartItems }) {
  const { authorId } = useParams();

  // DSA: O(1) author lookup
  const author = authorMap.get(authorId);

  // Get all books by this author, sorted by rating using MergeSort
  const authorBooks = useMemo(() => {
    const books = BOOKS_DATA.filter(b => b.authorId === authorId);
    return mergeSort(books, (a, b) => b.rating - a.rating);
  }, [authorId]);

  if (!author) {
    return (
      <div className="ap-error">
        <h2>Author not found</h2>
        <Link to="/" className="ap-back-link">← Back to Home</Link>
      </div>
    );
  }

  const avgRating = authorBooks.length > 0
    ? (authorBooks.reduce((sum, b) => sum + b.rating, 0) / authorBooks.length).toFixed(1)
    : 0;

  const totalReviews = authorBooks.reduce((sum, b) => sum + b.reviews.length, 0);

  return (
    <>
      <Navbar cartItems={cartItems} setCartItems={setCartItems} />
      <div className="ap-page" style={{ marginTop: '70px' }}>
      <div className="ap-container">
        <Link to="/" className="ap-back-link">← Back to Home</Link>

        {/* Author Hero */}
        <div className="ap-hero">
          <img src={author.photo} alt={author.name} className="ap-photo" />
          <div className="ap-hero-info">
            <h1 className="ap-name">{author.name}</h1>
            <div className="ap-stats-row">
              <span className="ap-stat">📚 {authorBooks.length} Books</span>
              <span className="ap-stat">⭐ {avgRating} Avg Rating</span>
              <span className="ap-stat">💬 {totalReviews} Reviews</span>
              <span className="ap-stat">🌍 {author.nationality}</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <section className="ap-section">
          <h2>About</h2>
          <p className="ap-bio">{author.bio}</p>
          <div className="ap-details-grid">
            <div className="ap-detail-item">
              <strong>Born</strong>
              <span>{author.birthDate}</span>
            </div>
            {author.deathDate && (
              <div className="ap-detail-item">
                <strong>Died</strong>
                <span>{author.deathDate}</span>
              </div>
            )}
            <div className="ap-detail-item">
              <strong>Nationality</strong>
              <span>{author.nationality}</span>
            </div>
          </div>
        </section>

        {/* Notable Works */}
        <section className="ap-section">
          <h2>Notable Works</h2>
          <div className="ap-notable-list">
            {author.notableWorks.map((work, idx) => (
              <span key={idx} className="ap-notable-tag">{work}</span>
            ))}
          </div>
        </section>

        {/* Books by this Author (sorted by rating via MergeSort) */}
        <section className="ap-section">
          <h2>Books by {author.name}</h2>
          <p className="ap-sort-note">Sorted by rating (highest first) using custom Merge Sort</p>
          <div className="ap-books-grid">
            {authorBooks.map(book => (
              <Link key={book.id} to={`/book/${book.id}`} className="ap-book-card">
                <BookImage image={book.image} featuredImage={book.featuredImage} title={book.title} />
                <div className="ap-book-info">
                  <h3>{book.title}</h3>
                  <div className="ap-book-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < Math.floor(book.rating) ? 'ap-star filled' : 'ap-star'}>★</span>
                    ))}
                    <span>{book.rating}</span>
                  </div>
                  <p className="ap-book-desc">{book.description.substring(0, 100)}...</p>
                  <div className="ap-book-footer">
                    <span className="ap-book-price">${book.price.toFixed(2)}</span>
                    <span className="ap-book-year">{book.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
