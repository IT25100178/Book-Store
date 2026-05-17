// src/components/books/SearchBooks.jsx — fixed CSS import path
import { useState } from 'react';
import './SearchBooks.css';

export default function SearchBooks({ searchTerm, onSearch }) {
  const [inputValue, setInputValue] = useState(searchTerm || '');

  const handleChange = (e) => { const v = e.target.value; setInputValue(v); onSearch(v); };
  const handleClear  = ()  => { setInputValue(''); onSearch(''); };

  return (
    <div className="search-books-container">
      <div className="search-input-wrapper">
        <input
          id="book-search-input"
          type="text"
          placeholder="Search by title, author, or description..."
          value={inputValue}
          onChange={handleChange}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
        {inputValue && (
          <button className="clear-btn" onClick={handleClear} title="Clear search">✕</button>
        )}
      </div>
      {inputValue && <p className="search-hint">Results update as you type</p>}
    </div>
  );
}
