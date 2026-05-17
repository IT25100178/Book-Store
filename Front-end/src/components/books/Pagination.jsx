// src/components/books/Pagination.jsx — fixed CSS path
import './Pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end   = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3)              end   = 4;
      if (currentPage > totalPages - 3) start = totalPages - 3;
      if (start > 2)           pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      <button className="pagination-btn prev-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>← Previous</button>
      <div className="page-numbers">
        {getPageNumbers().map((page, i) => (
          <button
            key={i}
            className={`page-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
            onClick={() => { if (typeof page === 'number') onPageChange(page); }}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>
      <button className="pagination-btn next-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next →</button>
      <div className="pagination-info">Page {currentPage} of {totalPages}</div>
    </div>
  );
}
