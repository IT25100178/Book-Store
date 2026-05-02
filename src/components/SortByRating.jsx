// src/components/SortByRating.jsx
import './SortByRating.css';

export default function SortByRating({ sortBy, sortOrder, onSort }) {
  const handleClick = () => {
    if (sortBy === 'rating') {
      // Toggle sort order if already sorting by rating
      onSort('rating', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Start sorting by rating in descending order (highest first)
      onSort('rating', 'desc');
    }
  };

  const isActive = sortBy === 'rating';

  return (
    <button
      className={`sort-rating-btn ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      title="Sort by rating"
    >
      <span className="sort-icon">⭐</span>
      Rating
      {isActive && (
        <span className="sort-indicator">
          {sortOrder === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </button>
  );
}
