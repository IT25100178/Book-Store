// src/components/books/BookListPage.jsx
// Member 2 – Deepika
// Wrapper that fetches books from the Java API and passes them to BookList UI components
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { books as booksApi } from '../../services/api';
import BookCard from './BookCard';
import SearchBooks from './SearchBooks';
import FilterByCategory from './FilterByCategory';
import SortByPrice from './SortByPrice';
import SortByRating from './SortByRating';
import Pagination from './Pagination';
import CategorySidebar from './CategorySidebar';
import './BookList.css';

export default function BookListPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [books,            setBooks]            = useState([]);
  const [categories,       setCategories]       = useState(['All']);
  const [total,            setTotal]            = useState(0);
  const [totalPages,       setTotalPages]       = useState(1);
  const [loading,          setLoading]          = useState(true);
  const [notification,     setNotification]     = useState('');

  // ── Filter / Sort State ───────────────────────────────────────────────────
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy,           setSortBy]           = useState('none');
  const [sortOrder,        setSortOrder]        = useState('asc');
  const [currentPage,      setCurrentPage]      = useState(1);
  const PAGE_SIZE = 9;

  // ── Map local sort state to API sortBy param ──────────────────────────────
  const apiSortBy = () => {
    if (sortBy === 'price')  return sortOrder === 'asc' ? 'price_asc'  : 'price_desc';
    if (sortBy === 'rating') return sortOrder === 'asc' ? 'rating_asc' : 'rating_desc';
    return '';
  };

  // ── Fetch from Java Backend ───────────────────────────────────────────────
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { ok, data } = await booksApi.list({
        search:   searchTerm,
        category: selectedCategory,
        sortBy:   apiSortBy(),
        page:     currentPage,
        pageSize: PAGE_SIZE,
      });
      if (ok) {
        setBooks(data.books      || []);
        setTotal(data.total      || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (_) {
      // Backend not available – show empty state
      setBooks([]);
    }
    setLoading(false);
  }, [searchTerm, selectedCategory, sortBy, sortOrder, currentPage]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  // ── Fetch categories once ─────────────────────────────────────────────────
  useEffect(() => {
    booksApi.categories().then(({ ok, data }) => {
      if (ok && Array.isArray(data)) setCategories(data);
    });
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFilterChange = (type, value) => {
    setCurrentPage(1);
    if (type === 'search')   setSearchTerm(value);
    if (type === 'category') setSelectedCategory(value);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const handleAddToCart = async (book) => {
    if (!user) { navigate('/login'); return; }
    const result = await addToCart(book.id, 1);
    const msg = result.success ? `"${book.title}" added to cart!` : (result.error || 'Failed to add');
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex   = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <div className="book-list-container">
      {notification && (
        <div style={{
          position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 9999,
          background: '#8B0000', color: '#D4AF37', padding: '0.75rem 1.5rem',
          borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)', animation: 'slideIn 0.3s ease',
        }}>
          {notification}
        </div>
      )}

      <div className="book-list-header">
        <h1>Book Store</h1>
        <p>Browsing {total} books in our collection</p>
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
          <div className="book-list-controls">
            <SearchBooks
              searchTerm={searchTerm}
              onSearch={(term) => handleFilterChange('search', term)}
            />
            <div className="sort-controls">
              <SortByPrice  sortBy={sortBy} sortOrder={sortOrder} onSort={handleSortChange} />
              <SortByRating sortBy={sortBy} sortOrder={sortOrder} onSort={handleSortChange} />
            </div>
          </div>

          <div className="results-info">
            {loading ? (
              <p>Loading books from server…</p>
            ) : (
              <p>
                {total === 0 ? 'No books found' : `Showing ${startIndex}–${endIndex} of ${total} books`}
              </p>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#D4AF37', fontSize: '1.5rem' }}>
              📚 Loading…
            </div>
          ) : books.length > 0 ? (
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No books found matching your criteria.</p>
              <button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setCurrentPage(1);
              }}>
                Reset Filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
