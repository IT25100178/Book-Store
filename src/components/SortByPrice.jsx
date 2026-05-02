// src/components/SortByPrice.jsx
import './SortByPrice.css';

export default function SortByPrice({ sortBy, sortOrder, onSort }) {
  const handleClick = () => {
    if (sortBy === 'price') {
      // Toggle sort order if already sorting by price
      onSort('price', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Start sorting by price in ascending order
      onSort('price', 'asc');
    }
  };

  const isActive = sortBy === 'price';

  return (
    <button
      className={`sort-price-btn ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      title="Sort by price"
    >
      <span className="sort-icon">💰</span>
      Price
      {isActive && (
        <span className="sort-indicator">
          {sortOrder === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </button>
  );
}
