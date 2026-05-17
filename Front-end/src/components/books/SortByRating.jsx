// src/components/books/SortByRating.jsx
import './SortByRating.css';
export default function SortByRating({ sortBy, sortOrder, onSort }) {
  const isActive    = sortBy === 'rating';
  const handleClick = () => onSort('rating', isActive && sortOrder === 'asc' ? 'desc' : 'asc');
  return (
    <button className={`sort-rating-btn ${isActive ? 'active' : ''}`} onClick={handleClick} title="Sort by rating">
      <span className="sort-icon">⭐</span>
      Rating
      {isActive && <span className="sort-indicator">{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>}
    </button>
  );
}
