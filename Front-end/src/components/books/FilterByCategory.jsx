// src/components/books/FilterByCategory.jsx
import './FilterByCategory.css';
export default function FilterByCategory({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="filter-category-container">
      <h3>Filter by Category</h3>
      <div className="category-options">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
