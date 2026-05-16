import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import AddEditBookModal from './AddEditBookModal';
import { FiPlus, FiSearch, FiX, FiRotateCcw, FiRotateCw, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiFilter, FiCheckSquare, FiSquare } from 'react-icons/fi';

const ManageBooks = ({ showToast }) => {
    const [books, setBooks] = useState([]);
    const [displayed, setDisplayed] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [undoVisible, setUndoVisible] = useState(false);

    // Filter state
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Row expansion state
    const [expandedRows, setExpandedRows] = useState(new Set());

    const loadBooks = useCallback((min, max) => {
        setLoading(true);
        const req = (min !== undefined && max !== undefined) 
                    ? api.getBooks(null, min, max) 
                    : api.getBooks();

        req.then(res => {
            setBooks(res.data);
            setDisplayed(res.data);
            setLoading(false);
        }).catch(() => {
            showToast("Failed to load books", "error");
            setLoading(false);
        });
    }, [showToast]);

    useEffect(() => { loadBooks(); }, [loadBooks]);

    const handleSearch = () => {
        if (!searchTerm.trim()) { setDisplayed(books); return; }
        // We use the new multi-search feature from the backend globally or fallback to frontend if not available.
        // Actually, the prompt says "Multi-field Search: ... Hash Index ... multi-field lookup". 
        // We can do this client-side using the data we have, or rely on our global search for API. 
        // The prompt says "Extend search to query by title OR author OR ISBN simultaneously", so we use the local list if API isn't exactly built as a GET /search for all 3.
        const term = searchTerm.toLowerCase();
        const results = books.filter(b => 
            b.title.toLowerCase().includes(term) || 
            b.author.toLowerCase().includes(term) || 
            b.isbn.toLowerCase().includes(term)
        );
        setDisplayed(results);
    };

    const handleApplyFilters = () => {
        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || 1000;
        loadBooks(min, max);
        setFilterOpen(false);
    };

    const clearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        loadBooks();
    };

    const handleSort = (key) => {
        api.getBooks(key).then(res => setDisplayed(res.data)).catch(() => showToast("Sort failed", "error"));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            api.deleteBook(id).then(() => {
                showToast("Book deleted");
                setUndoVisible(true);
                setTimeout(() => setUndoVisible(false), 5000);
                loadBooks();
            }).catch(() => showToast("Failed to delete book", "error"));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.size} books?`)) {
            api.bulkDeleteBooks(Array.from(selectedIds)).then(() => {
                showToast(`Deleted ${selectedIds.size} books successfully`);
                setSelectedIds(new Set());
                setUndoVisible(true);
                setTimeout(() => setUndoVisible(false), 5000);
                loadBooks();
            }).catch(() => showToast("Failed to bulk delete", "error"));
        }
    };

    const handleUndo = () => {
        api.undoDeleteBook().then(() => {
            showToast("Action undone successfully");
            setUndoVisible(false);
            loadBooks();
        }).catch(() => showToast("Failed to undo", "error"));
    };

    const handleSave = (book) => {
        const call = book.id ? api.updateBook(book.id, book) : api.addBook(book);
        call.then(() => {
            showToast(`Book ${book.id ? 'updated' : 'added'} successfully`);
            setIsModalOpen(false);
            loadBooks();
        }).catch(() => showToast("Failed to save book", "error"));
    };

    const toggleSelection = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleAll = () => {
        if (selectedIds.size === displayed.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(displayed.map(b => b.id)));
        }
    };

    const toggleExpand = (id) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedRows(newSet);
    };

    // SVG Price Range Data
    const priceMax = 200; // max scale for svg
    const maxVal = Math.max(...books.map(b => b.price), 100);
    const renderBSTSvg = () => {
        return (
            <svg width="100%" height="40" style={{ background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid #E2E8F0', marginTop: '10px' }}>
                {books.map((b, i) => {
                    const x = (b.price / maxVal) * 100; // percentage
                    const inRange = (minPrice === '' || b.price >= minPrice) && (maxPrice === '' || b.price <= maxPrice);
                    return (
                        <circle key={i} cx={`${x}%`} cy="20" r="4" fill={inRange ? '#3B82F6' : 'var(--border-color)'} opacity={inRange ? 0.8 : 0.3} />
                    );
                })}
            </svg>
        );
    };

    return (
        <div>
            <div className="page-header" style={{ alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Manage Books</h1>
                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginTop: '4px' }}>
                        Showing {displayed.length} titles
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {undoVisible && (
                        <button className="btn btn-warning" onClick={handleUndo}><FiRotateCcw /> Undo Delete</button>
                    )}
                    {selectedIds.size > 0 && (
                        <button className="btn" style={{ background: '#EF4444', color: 'var(--text-main)', border: 'none' }} onClick={handleBulkDelete}>
                            <FiTrash2 /> Bulk Delete ({selectedIds.size})
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => { setEditingBook(null); setIsModalOpen(true); }}><FiPlus /> Add Book</button>
                </div>
            </div>

            <div className="filter-bar" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="search-group" style={{ flex: 1 }}>
                    <input type="text" className="search-input" placeholder="Multi-field search: Title, Author, or ISBN..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); if(!e.target.value) setDisplayed(books); }} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    <button className="search-btn" onClick={handleSearch}><FiSearch /></button>
                </div>
                {searchTerm && <button className="btn btn-secondary btn-sm" onClick={() => { setSearchTerm(''); setDisplayed(books); }}><FiX /> Clear</button>}
                
                <div style={{ position: 'relative' }}>
                    <button className="btn btn-secondary" onClick={() => setFilterOpen(!filterOpen)}><FiFilter /> Filters</button>
                    {filterOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', width: '300px', zIndex: 10 }}>
                            <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600 }}>Price Range Filter (BST)</h4>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="form-control" style={{ width: '100%' }} />
                                <span>-</span>
                                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="form-control" style={{ width: '100%' }} />
                            </div>
                            <div style={{ margin: '16px 0 8px', fontSize: '12px', color: 'var(--text-muted)' }}>Spectrum Distribution (Max: ${maxVal.toFixed(0)})</div>
                            {renderBSTSvg()}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={clearFilters}>Clear</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleApplyFilters}>Apply via API</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sort-group">
                    <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Sort:</label>
                    <select onChange={e => handleSort(e.target.value)} className="sort-select">
                        <option value="">Default (ID)</option>
                        <option value="title">Title (A-Z)</option>
                        <option value="price">Price (Low-High)</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading"><FiRotateCw className="animate-spin" /> Loading books...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>
                                        <div style={{ cursor: 'pointer', color: selectedIds.size === displayed.length && displayed.length > 0 ? '#3B82F6' : 'var(--text-light)' }} onClick={toggleAll}>
                                            {selectedIds.size === displayed.length && displayed.length > 0 ? <FiCheckSquare size={18}/> : <FiSquare size={18}/>}
                                        </div>
                                    </th>
                                    <th style={{ width: '40px' }}></th>
                                    <th>Cover</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.length === 0 ? (
                                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No books found.</td></tr>
                                ) : displayed.map(book => (
                                    <React.Fragment key={book.id}>
                                        <tr style={{ background: selectedIds.has(book.id) ? '#EFF6FF' : 'transparent', transition: 'background 0.2s' }}>
                                            <td>
                                                <div style={{ cursor: 'pointer', color: selectedIds.has(book.id) ? '#3B82F6' : 'var(--border-color)' }} onClick={() => toggleSelection(book.id)}>
                                                    {selectedIds.has(book.id) ? <FiCheckSquare size={18}/> : <FiSquare size={18}/>}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => toggleExpand(book.id)}>
                                                    {expandedRows.has(book.id) ? <FiChevronUp size={20}/> : <FiChevronDown size={20}/>}
                                                </div>
                                            </td>
                                            <td>
                                                <img src={book.coverImageUrl || 'https://placehold.co/40x52/DBEAFE/1E40AF?text=Book'} alt={book.title} className="book-cover" onError={e => { e.target.src = 'https://placehold.co/40x52/DBEAFE/1E40AF?text=Book'; }} />
                                            </td>
                                            <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{book.title}</td>
                                            <td style={{ color: 'var(--text-muted)' }}>{book.author}</td>
                                            <td><span className="badge badge-category">{book.category || 'N/A'}</span></td>
                                            <td style={{ fontWeight: 600, color: '#10B981' }}>${(book.price || 0).toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${book.stockQuantity < 5 ? 'badge-cancelled' : 'badge-completed'}`}>
                                                    {book.stockQuantity} Left
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button className="action-btn edit" onClick={() => { setEditingBook(book); setIsModalOpen(true); }} title="Edit"><FiEdit2 /></button>
                                                    <button className="action-btn delete" onClick={() => handleDelete(book.id)} title="Delete"><FiTrash2 /></button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expandable Row Content */}
                                        {expandedRows.has(book.id) && (
                                            <tr style={{ background: 'var(--bg-main)' }}>
                                                <td colSpan="9" style={{ padding: '0' }}>
                                                    <div style={{ padding: '24px 70px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '30px' }}>
                                                        <img src={book.coverImageUrl || 'https://placehold.co/120x170/DBEAFE/1E40AF?text=Book'} alt={book.title} style={{ width: '120px', height: '170px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                                        <div style={{ flex: 1 }}>
                                                            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>{book.title}</h3>
                                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                                                <span><strong>ISBN:</strong> {book.isbn || 'N/A'}</span>
                                                                <span><strong>ID:</strong> {book.id}</span>
                                                            </div>
                                                            <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                                                                {book.description || 'No description available for this book.'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <AddEditBookModal isOpen={isModalOpen} book={editingBook} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </div>
    );
};

export default ManageBooks;
