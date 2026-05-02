// src/components/BookDetails.jsx
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import BookImage from './BookImage';
import './BookDetails.css';

// Sample books data - same as in BookList.jsx (you can import from a shared file later)
const BOOKS_DATA = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    authorDetails: {
      bio: 'Francis Scott Key Fitzgerald was an American novelist, essayist, and short story writer. He is best known for his novels depicting the flamboyance and excess of the Jazz Age—a term he popularized.',
      birthDate: 'September 24, 1896',
      deathDate: 'December 21, 1940',
      nationality: 'American',
      notableWorks: ['The Great Gatsby', 'Tender Is the Night', 'The Beautiful and Damned']
    },
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
    year: 1925,
    stock: 15,
    reviews: [
      { id: 1, user: 'John Doe', rating: 5, comment: 'Amazing book! A classic that everyone should read.', date: '2023-10-01' },
      { id: 2, user: 'Jane Smith', rating: 4, comment: 'Great story, but the ending was a bit predictable.', date: '2023-09-15' },
      { id: 3, user: 'Bob Johnson', rating: 5, comment: 'Fitzgerald\'s writing is beautiful. Highly recommend!', date: '2023-08-20' }
    ]
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    authorDetails: {
      bio: 'Nelle Harper Lee was an American novelist widely known for To Kill a Mockingbird, published in 1960. She received the Pulitzer Prize and Presidential Medal of Freedom for literature.',
      birthDate: 'April 28, 1926',
      deathDate: 'February 19, 2016',
      nationality: 'American',
      notableWorks: ['To Kill a Mockingbird', 'Go Set a Watchman']
    },
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
    year: 1960,
    stock: 8,
    reviews: [
      { id: 1, user: 'Alice Brown', rating: 5, comment: 'A powerful story about justice and morality.', date: '2023-11-05' },
      { id: 2, user: 'Charlie Wilson', rating: 4, comment: 'Very moving. The characters are well-developed.', date: '2023-10-12' }
    ]
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    authorDetails: {
      bio: 'Eric Arthur Blair, better known by his pen name George Orwell, was an English novelist, essayist, journalist and critic. His work is marked by lucid prose, awareness of social injustice, and opposition to totalitarianism.',
      birthDate: 'June 25, 1903',
      deathDate: 'January 21, 1950',
      nationality: 'British',
      notableWorks: ['1984', 'Animal Farm', 'Down and Out in Paris and London']
    },
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
    year: 1949,
    stock: 20,
    reviews: [
      { id: 1, user: 'Diana Prince', rating: 5, comment: 'Timeless warning about totalitarianism.', date: '2023-12-01' },
      { id: 2, user: 'Eve Adams', rating: 4, comment: 'Disturbing but important read.', date: '2023-11-18' },
      { id: 3, user: 'Frank Miller', rating: 5, comment: 'Orwell\'s masterpiece. Essential reading.', date: '2023-10-25' }
    ]
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    authorDetails: {
      bio: 'Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
      birthDate: 'December 16, 1775',
      deathDate: 'July 18, 1817',
      nationality: 'British',
      notableWorks: ['Pride and Prejudice', 'Sense and Sensibility', 'Emma', 'Persuasion']
    },
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
    year: 1813,
    stock: 12,
    reviews: [
      { id: 1, user: 'Grace Lee', rating: 5, comment: 'Witty and charming. Austen at her best!', date: '2023-09-30' },
      { id: 2, user: 'Henry Ford', rating: 4, comment: 'Love the social commentary.', date: '2023-09-10' }
    ]
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    authorDetails: {
      bio: 'John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic. He is best known as the author of the classic high fantasy works The Hobbit, The Lord of the Rings, and The Silmarillion.',
      birthDate: 'January 3, 1892',
      deathDate: 'September 2, 1973',
      nationality: 'British',
      notableWorks: ['The Hobbit', 'The Lord of the Rings', 'The Silmarillion']
    },
    price: 15.99,
    originalPrice: 22.99,
    rating: 4.9,
    category: 'Fantasy',
    image: '🐉',
    featuredImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=400&fit=crop',
    description: 'A fantasy novel about Bilbo Baggins and his unexpected adventure with wizards and dwarves.',
    isNew: false,
    isBestseller: true,
    pages: 310,
    year: 1937,
    stock: 25,
    reviews: [
      { id: 1, user: 'Ian Fleming', rating: 5, comment: 'Perfect introduction to Tolkien\'s world.', date: '2023-11-20' },
      { id: 2, user: 'Julia Roberts', rating: 5, comment: 'Magical adventure! Loved every page.', date: '2023-10-30' },
      { id: 3, user: 'Kevin Spacey', rating: 4, comment: 'Great story, though a bit slow at times.', date: '2023-10-05' }
    ]
  },
  {
    id: 6,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    authorDetails: {
      bio: 'Jerome David Salinger was an American writer best known for his novel The Catcher in the Rye. Following his debut in 1940, Salinger published several additional short stories, but in 1951 he published his only novel.',
      birthDate: 'January 1, 1919',
      deathDate: 'January 27, 2010',
      nationality: 'American',
      notableWorks: ['The Catcher in the Rye', 'Nine Stories', 'Franny and Zooey']
    },
    price: 13.49,
    originalPrice: 18.49,
    rating: 4.4,
    category: 'Classic',
    image: '📓',
    featuredImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    description: 'A controversial novel about teenage rebellion and alienation.',
    isNew: false,
    isBestseller: false,
    pages: 277,
    year: 1951,
    stock: 10,
    reviews: [
      { id: 1, user: 'Laura Palmer', rating: 4, comment: 'Raw and honest portrayal of adolescence.', date: '2023-08-15' },
      { id: 2, user: 'Mike Tyson', rating: 5, comment: 'Changed my perspective on life.', date: '2023-07-22' }
    ]
  },
  {
    id: 7,
    title: 'Animal Farm',
    author: 'George Orwell',
    authorDetails: {
      bio: 'Eric Arthur Blair, better known by his pen name George Orwell, was an English novelist, essayist, journalist and critic. His work is marked by lucid prose, awareness of social injustice, and opposition to totalitarianism.',
      birthDate: 'June 25, 1903',
      deathDate: 'January 21, 1950',
      nationality: 'British',
      notableWorks: ['1984', 'Animal Farm', 'Down and Out in Paris and London']
    },
    price: 11.99,
    originalPrice: 16.99,
    rating: 4.6,
    category: 'Dystopian',
    image: '🐖',
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    description: 'A satirical novella about a group of farm animals who rebel against their human farmer, only to discover that life under the new regime is just as oppressive.',
    isNew: false,
    isBestseller: true,
    pages: 112,
    year: 1945,
    stock: 18,
    reviews: [
      { id: 1, user: 'Emma Watson', rating: 5, comment: 'Brilliant allegory about power and corruption.', date: '2023-10-20' },
      { id: 2, user: 'Daniel Radcliffe', rating: 4, comment: 'Timeless message, though quite short.', date: '2023-09-25' }
    ]
  },
  {
    id: 8,
    title: 'Sense and Sensibility',
    author: 'Jane Austen',
    authorDetails: {
      bio: 'Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
      birthDate: 'December 16, 1775',
      deathDate: 'July 18, 1817',
      nationality: 'British',
      notableWorks: ['Pride and Prejudice', 'Sense and Sensibility', 'Emma', 'Persuasion']
    },
    price: 10.99,
    originalPrice: 15.99,
    rating: 4.3,
    category: 'Romance',
    image: '💃',
    featuredImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    description: 'A story of two sisters, Elinor and Marianne Dashwood, who face very different challenges in their search for love and happiness.',
    isNew: false,
    isBestseller: false,
    pages: 352,
    year: 1811,
    stock: 14,
    reviews: [
      { id: 1, user: 'Sophie Turner', rating: 4, comment: 'Beautiful writing, but slower pace than modern novels.', date: '2023-08-30' }
    ]
  },
  {
    id: 9,
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    authorDetails: {
      bio: 'John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic. He is best known as the author of the classic high fantasy works The Hobbit, The Lord of the Rings, and The Silmarillion.',
      birthDate: 'January 3, 1892',
      deathDate: 'September 2, 1973',
      nationality: 'British',
      notableWorks: ['The Hobbit', 'The Lord of the Rings', 'The Silmarillion']
    },
    price: 18.99,
    originalPrice: 25.99,
    rating: 4.8,
    category: 'Fantasy',
    image: '🧙',
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    description: 'The first volume of the epic fantasy trilogy, following Frodo Baggins and the Fellowship as they embark on a quest to destroy the One Ring.',
    isNew: false,
    isBestseller: true,
    pages: 423,
    year: 1954,
    stock: 22,
    reviews: [
      { id: 1, user: 'Orlando Bloom', rating: 5, comment: 'Masterpiece of fantasy literature!', date: '2023-11-15' },
      { id: 2, user: 'Liv Tyler', rating: 5, comment: 'Incredible world-building and characters.', date: '2023-10-28' },
      { id: 3, user: 'Viggo Mortensen', rating: 4, comment: 'Epic journey, though quite long.', date: '2023-10-10' }
    ]
  },
  {
    id: 10,
    title: 'Nine Stories',
    author: 'J.D. Salinger',
    authorDetails: {
      bio: 'Jerome David Salinger was an American writer best known for his novel The Catcher in the Rye. Following his debut in 1940, Salinger published several additional short stories, but in 1951 he published his only novel.',
      birthDate: 'January 1, 1919',
      deathDate: 'January 27, 2010',
      nationality: 'American',
      notableWorks: ['The Catcher in the Rye', 'Nine Stories', 'Franny and Zooey']
    },
    price: 12.99,
    originalPrice: 17.99,
    rating: 4.2,
    category: 'Classic',
    image: '📚',
    featuredImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    description: 'A collection of nine short stories by J.D. Salinger, showcasing his distinctive style and themes.',
    isNew: false,
    isBestseller: false,
    pages: 198,
    year: 1953,
    stock: 9,
    reviews: [
      { id: 1, user: 'Mia Farrow', rating: 4, comment: 'Salinger\'s unique voice shines through.', date: '2023-07-15' }
    ]
  }
];

export default function BookDetails() {
  const { id } = useParams();
  const book = BOOKS_DATA.find(b => b.id === parseInt(id));

  const [cartMessage, setCartMessage] = useState('');

  if (!book) {
    return <div className="book-details-error">Book not found</div>;
  }

  const discountPercentage = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );

  const relatedBooks = BOOKS_DATA.filter(b => b.category === book.category && b.id !== book.id);
  const authorBooks = BOOKS_DATA.filter(b => b.author === book.author && b.id !== book.id);

  const handleAddToCart = () => {
    setCartMessage('Added to cart!');
    setTimeout(() => setCartMessage(''), 2000);
  };

  return (
    <div className="book-details">
      <div className="book-details-container">
        {/* Back Button */}
        <Link to="/books" className="back-button">← Back to Books</Link>

        <div className="book-details-main">
          {/* Book Image Section */}
          <div className="book-image-section">
            <BookImage
              image={book.image}
              featuredImage={book.featuredImage}
              title={book.title}
            />
          </div>

          {/* Book Info Section */}
          <div className="book-info-section">
            {/* Badges */}
            <div className="book-badges">
              {book.isNew && <span className="badge badge-new">New</span>}
              {book.isBestseller && <span className="badge badge-bestseller">Bestseller</span>}
              {discountPercentage > 0 && (
                <span className="badge badge-discount">-{discountPercentage}%</span>
              )}
            </div>

            {/* Title and Author */}
            <h1 className="book-title">{book.title}</h1>
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
              <span className="rating-value">({book.rating}) - {book.reviews.length} reviews</span>
            </div>

            {/* Price and Stock */}
            <div className="price-stock-section">
              <div className="book-price">
                <span className="price">${book.price.toFixed(2)}</span>
                {book.originalPrice > book.price && (
                  <span className="original-price">${book.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="stock-info">
                <span className={`stock-status ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="add-to-cart-section">
              <button
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={book.stock === 0}
              >
                {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              {cartMessage && <span className="cart-message">{cartMessage}</span>}
            </div>

            {/* Book Meta */}
            <div className="book-meta">
              <span className="category">Category: {book.category}</span>
              <span className="pages">Pages: {book.pages}</span>
              <span className="year">Published: {book.year}</span>
            </div>
          </div>
        </div>

        {/* Book Description */}
        <div className="book-description-section">
          <h2>Description</h2>
          <p className="book-description">{book.description}</p>
        </div>

        {/* Author Details */}
        <div className="author-details-section">
          <h2>About the Author</h2>
          <div className="author-info">
            <div className="author-bio">
              <p>{book.authorDetails.bio}</p>
            </div>
            <div className="author-meta">
              <div className="author-detail-item">
                <strong>Birth Date:</strong> {book.authorDetails.birthDate}
              </div>
              <div className="author-detail-item">
                <strong>Death Date:</strong> {book.authorDetails.deathDate}
              </div>
              <div className="author-detail-item">
                <strong>Nationality:</strong> {book.authorDetails.nationality}
              </div>
              <div className="author-detail-item">
                <strong>Notable Works:</strong>
                <ul>
                  {book.authorDetails.notableWorks.map((work, index) => (
                    <li key={index}>{work}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Book Reviews */}
        <div className="book-reviews-section">
          <h2>Customer Reviews ({book.reviews.length})</h2>
          <div className="reviews-list">
            {book.reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <div className="review-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Books */}
        {authorBooks.length > 0 && (
          <div className="related-books-section">
            <h2>Related Books</h2>
            <p className="section-description">More books by {book.author}</p>
            <div className="related-books-grid">
              {authorBooks.map(relatedBook => (
                <Link key={relatedBook.id} to={`/book/${relatedBook.id}`} className="related-book-card">
                  <BookImage
                    image={relatedBook.image}
                    featuredImage={relatedBook.featuredImage}
                    title={relatedBook.title}
                  />
                  <h3>{relatedBook.title}</h3>
                  <p>by {relatedBook.author}</p>
                  <div className="related-book-price">${relatedBook.price.toFixed(2)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Similar Category Books */}
        {relatedBooks.length > 0 && (
          <div className="related-books-section">
            <h2>Similar Category Books</h2>
            <p className="section-description">More books in {book.category} category</p>
            <div className="related-books-grid">
              {relatedBooks.map(relatedBook => (
                <Link key={relatedBook.id} to={`/book/${relatedBook.id}`} className="related-book-card">
                  <BookImage
                    image={relatedBook.image}
                    featuredImage={relatedBook.featuredImage}
                    title={relatedBook.title}
                  />
                  <h3>{relatedBook.title}</h3>
                  <p>by {relatedBook.author}</p>
                  <div className="related-book-price">${relatedBook.price.toFixed(2)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}