// src/components/books/SortByPrice.jsx
import './SortByPrice.css';
export default function SortByPrice({ sortBy, sortOrder, onSort }) {
  const isActive  = sortBy === 'price';
  const handleClick = () => onSort('price', isActive && sortOrder === 'asc' ? 'desc' : 'asc');
  return (
    <button className={`sort-price-btn ${isActive ? 'active' : ''}`} onClick={handleClick} title="Sort by price">
      <span className="sort-icon">💰</span>
      Price
      {isActive && <span className="sort-indicator">{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>}
    </button>
  );
}
