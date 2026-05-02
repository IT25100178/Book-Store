// src/components/CategorySidebar.jsx
import './CategorySidebar.css';

export default function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory
}) {
  return (
    <div className="category-sidebar">
      <div className="sidebar-section">
        <h2 className="sidebar-title">Categories</h2>

        <nav className="category-list">
          {categories.map(category => (
            <button
              key={category}
              className={`category-link ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              <span className="category-name">{category}</span>
              <span className="category-arrow">→</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Additional Sidebar Sections */}
      <div className="sidebar-section">
        <h3 className="sidebar-subtitle">Price Range</h3>
        <div className="price-info">
          <p>Currently showing all price ranges</p>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-subtitle">Ratings</h3>
        <div className="rating-filter">
          <p>Filter by minimum rating to see in sort options</p>
        </div>
      </div>

      <div className="sidebar-section sidebar-footer">
        <p className="sidebar-hint">💡 Use the controls above to filter and sort books</p>
      </div>
    </div>
  );
}
