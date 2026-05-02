// src/components/SearchBooks.jsx
import { useState } from 'react';
import './SearchBooks.css';

export default function SearchBooks({ searchTerm, onSearch }) {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className="search-books-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by title, author, or description..."
          value={inputValue}
          onChange={handleChange}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
        {inputValue && (
          <button className="clear-btn" onClick={handleClear} title="Clear search">
            ✕
          </button>
        )}
      </div>
      {inputValue && (
        <p className="search-hint">Search results update as you type</p>
      )}
    </div>
  );
}
