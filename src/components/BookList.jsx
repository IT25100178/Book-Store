// src/components/BookList.jsx
import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import BookCard from './BookCard';
import SearchBooks from './SearchBooks';
import FilterByCategory from './FilterByCategory';
import SortByPrice from './SortByPrice';
import SortByRating from './SortByRating';
import Pagination from './Pagination';
import CategorySidebar from './CategorySidebar';
import './BookList.css';

// Sample books data - same as in Home.jsx
const BOOKS_DATA = [
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
    featuredImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=400&fit=crop',
    description: 'A fantasy novel about Bilbo Baggins and his unexpected adventure with wizards and dwarves.',
    isNew: false,
    isBestseller: true,
    pages: 310,
    year: 1937
  },
  { 
    id: 6, 
    title: 'The Catcher in the Rye', 
    author: 'J.D. Salinger', 
    price: 13.49, 
    originalPrice: 18.49,
    rating: 4.3,
    category: 'Fiction',
    image: '📖',
    featuredImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=400&fit=crop',
    description: 'The story of Holden Caulfield, a teenage boy navigating the complexities of growing up.',
    isNew: false,
    isBestseller: false,
    pages: 214,
    year: 1951
  },
  { 
    id: 7, 
    title: 'Jane Eyre', 
    author: 'Charlotte Brontë', 
    price: 10.99, 
    originalPrice: 16.99,
    rating: 4.7,
    category: 'Romance',
    image: '💕',
    featuredImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e86?w=600&h=400&fit=crop',
    description: 'A powerful romantic novel about a woman\'s struggle for independence and love.',
    isNew: false,
    isBestseller: true,
    pages: 448,
    year: 1847
  },
  { 
    id: 8, 
    title: 'Brave New World', 
    author: 'Aldous Huxley', 
    price: 14.49, 
    originalPrice: 19.99,
    rating: 4.5,
    category: 'Dystopian',
    image: '📕',
    featuredImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop',
    description: 'A dystopian novel depicting a futuristic World State and the costs of its stability.',
    isNew: true,
    isBestseller: false,
    pages: 288,
    year: 1932
  },
  { 
    id: 9, 
    title: 'The Lord of the Rings', 
    author: 'J.R.R. Tolkien', 
    price: 19.99, 
    originalPrice: 29.99,
    rating: 4.9,
    category: 'Fantasy',
    image: '🐉',
    featuredImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=400&fit=crop',
    description: 'An epic fantasy trilogy about the quest to destroy the One Ring and save Middle-earth.',
    isNew: false,
    isBestseller: true,
    pages: 1178,
    year: 1954
  },
  { 
    id: 10, 
    title: 'Wuthering Heights', 
    author: 'Emily Brontë', 
    price: 11.49, 
    originalPrice: 17.99,
    rating: 4.2,
    category: 'Classic',
    image: '📚',
    featuredImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&h=400&fit=crop',
    description: 'A dark romantic novel set on the Yorkshire moors with themes of love and revenge.',
    isNew: false,
    isBestseller: false,
    pages: 323,
    year: 1847
  },
  { 
    id: 11, 
    title: 'The Chronicles of Narnia', 
    author: 'C.S. Lewis', 
    price: 12.99, 
    originalPrice: 18.99,
    rating: 4.8,
    category: 'Fantasy',
    image: '🐉',
    featuredImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=400&fit=crop',
    description: 'A series of fantasy novels about children who discover a magical world called Narnia.',
    isNew: false,
    isBestseller: true,
    pages: 768,
    year: 1950
  },
  { 
    id: 12, 
    title: 'Sense and Sensibility', 
    author: 'Jane Austen', 
    price: 10.99, 
    originalPrice: 16.49,
    rating: 4.4,
    category: 'Romance',
    image: '💕',
    featuredImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e86?w=600&h=400&fit=crop',
    description: 'A romantic novel contrasting two sisters with different personalities and approaches to love.',
    isNew: false,
    isBestseller: false,
    pages: 432,
    year: 1811
  }
];

export default function BookList({ onAddToCart }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('none');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Get unique categories
  const categories = ['All', ...new Set(BOOKS_DATA.map(book => book.category))];

  // Filter books
  const filteredBooks = useMemo(() => {
    let result = BOOKS_DATA;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(book => book.category === selectedCategory);
    }

    return result;
  }, [searchTerm, selectedCategory]);

  // Sort books
  const sortedBooks = useMemo(() => {
    let result = [...filteredBooks];

    if (sortBy === 'price') {
      result.sort((a, b) =>
        sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
    } else if (sortBy === 'rating') {
      result.sort((a, b) =>
        sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
      );
    } else if (sortBy === 'title') {
      result.sort((a, b) =>
        sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [filteredBooks, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = sortedBooks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (type, value) => {
    setCurrentPage(1);
    if (type === 'search') setSearchTerm(value);
    if (type === 'category') setSelectedCategory(value);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h1>Book Store</h1>
        <p>Browse our collection of {BOOKS_DATA.length} books</p>
      </div>

      <div className="book-list-main">
        {/* Sidebar */}
        <aside className="book-list-sidebar">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => handleFilterChange('category', cat)}
          />
        </aside>

        {/* Main Content */}
        <main className="book-list-content">
          {/* Controls */}
          <div className="book-list-controls">
            <SearchBooks
              searchTerm={searchTerm}
              onSearch={(term) => handleFilterChange('search', term)}
            />

            <div className="sort-controls">
              <SortByPrice
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSortChange}
              />
              <SortByRating
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSortChange}
              />
            </div>
          </div>

          {/* Results Info */}
          <div className="results-info">
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, sortedBooks.length)} of{' '}
              {sortedBooks.length} books
            </p>
          </div>

          {/* Books Grid */}
          {paginatedBooks.length > 0 ? (
            <div className="books-grid">
              {paginatedBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No books found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
