import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { FiPackage, FiAlertTriangle, FiCheckCircle, FiEdit2, FiRotateCw, FiDownload } from 'react-icons/fi';

const StockManager = ({ showToast }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [editId, setEditId] = useState(null);
    const [editQty, setEditQty] = useState('');
    const [search, setSearch] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        api.getBooks().then(r => { setBooks(r.data); setLoading(false); })
            .catch(() => { showToast('Failed to load inventory', 'error'); setLoading(false); });
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const getStatus = b => {
        if (b.stockQuantity === 0) return 'Out of Stock';
        if (b.stockQuantity < 5) return 'Low Stock';
        return 'In Stock';
    };

    const shown = books.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
        const status = getStatus(b);
        const matchFilter = filter === 'ALL' || status === filter;
        return matchSearch && matchFilter;
    });

    const counts = {
        total: books.length,
        outOfStock: books.filter(b => b.stockQuantity === 0).length,
        lowStock: books.filter(b => b.stockQuantity > 0 && b.stockQuantity < 5).length,
        inStock: books.filter(b => b.stockQuantity >= 5).length,
    };

    const startEdit = b => { setEditId(b.id); setEditQty(String(b.stockQuantity)); };
    const cancelEdit = () => { setEditId(null); setEditQty(''); };

    const saveStock = (book) => {
        const qty = parseInt(editQty);
        if (isNaN(qty) || qty < 0) return showToast('Invalid quantity', 'error');
        // Update locally (in a real app would call api.updateBook)
        api.updateBook(book.id, { ...book, stockQuantity: qty })
            .then(() => { showToast(`Stock updated for "${book.title}"`); cancelEdit(); load(); })
            .catch(() => { showToast('Failed to update stock', 'error'); });
    };

    const exportCSV = () => {
        const rows = books.map(b => `${b.title},${b.author},${b.stockQuantity},${getStatus(b)}`);
        const csv = 'Title,Author,Stock,Status\n' + rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'inventory.csv'; a.click();
        URL.revokeObjectURL(url);
        showToast('Inventory exported!');
    };

    const statusColor = s => ({ 'Out of Stock': '#F87171', 'Low Stock': '#FACC15', 'In Stock': '#4ADE80' }[s]);
    const statusBadge = s => ({ 'Out of Stock': 'badge-banned', 'Low Stock': 'badge-pending', 'In Stock': 'badge-active' }[s]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Stock & Inventory</h1>
                    <div style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 4 }}>Monitor and update book stock levels</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={load}><FiRotateCw /> Refresh</button>
                    <button className="btn btn-primary" onClick={exportCSV}><FiDownload /> Export CSV</button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Total Books', val: counts.total, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', icon: <FiPackage /> },
                    { label: 'In Stock', val: counts.inStock, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', icon: <FiCheckCircle /> },
                    { label: 'Low Stock (< 5)', val: counts.lowStock, color: '#FACC15', bg: 'rgba(250,204,21,0.1)', icon: <FiAlertTriangle /> },
                    { label: 'Out of Stock', val: counts.outOfStock, color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: <FiAlertTriangle /> },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, border: s.val > 0 && s.label !== 'In Stock' && s.label !== 'Total Books' ? `1px solid ${s.color}30` : undefined }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 20 }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>{s.val}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alerts */}
            {counts.outOfStock > 0 && (
                <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, padding: '12px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: '#F87171' }}>
                    <FiAlertTriangle /> <strong>{counts.outOfStock} book{counts.outOfStock > 1 ? 's' : ''} out of stock</strong> — update quantities below.
                </div>
            )}

            {/* Filter & Search */}
            <div className="filter-bar">
                <div className="search-group">
                    <input className="search-input" placeholder="Search title or author..." value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="search-btn"><FiPackage /></button>
                </div>
                <div className="tab-group">
                    {['ALL', 'In Stock', 'Low Stock', 'Out of Stock'].map(f => (
                        <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f} {f !== 'ALL' ? `(${counts[f.replace(' ', '')] ?? (f === 'In Stock' ? counts.inStock : f === 'Low Stock' ? counts.lowStock : counts.outOfStock)})` : ''}
                        </button>
                    ))}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{shown.length} items</span>
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiPackage color="#FACC15" /> Inventory ({shown.length})</span>
                </div>
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading"><FiRotateCw className="animate-spin" /> Loading inventory...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr><th>Cover</th><th>Title</th><th>Author</th><th>Category</th><th>Price</th><th>Stock Qty</th><th>Status</th><th style={{ textAlign: 'right' }}>Update Stock</th></tr>
                            </thead>
                            <tbody>
                                {shown.length === 0 ? (
                                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>No books match your filter.</td></tr>
                                ) : shown.map(b => {
                                    const status = getStatus(b);
                                    return (
                                        <tr key={b.id} style={{ borderLeft: status === 'Out of Stock' ? '4px solid #F87171' : status === 'Low Stock' ? '4px solid #FACC15' : 'none' }}>
                                            <td>
                                                <img src={b.coverImageUrl || 'https://placehold.co/40x52/161616/FACC15?text=B'} alt="" style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 4 }} onError={e => { e.target.src = 'https://placehold.co/40x52/161616/FACC15?text=B'; }} />
                                            </td>
                                            <td style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 13 }}>{b.title}</td>
                                            <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{b.author}</td>
                                            <td><span className="badge badge-category">{b.category || '—'}</span></td>
                                            <td style={{ color: '#4ADE80', fontWeight: 700 }}>${(b.price || 0).toFixed(2)}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ width: 60, height: 6, background: 'var(--border-color)', borderRadius: 3 }}>
                                                        <div style={{ height: '100%', borderRadius: 3, background: statusColor(status), width: `${Math.min(100, (b.stockQuantity / 20) * 100)}%` }} />
                                                    </div>
                                                    <span style={{ fontWeight: 700, color: statusColor(status), minWidth: 24 }}>{b.stockQuantity}</span>
                                                </div>
                                            </td>
                                            <td><span className={`badge ${statusBadge(status)}`}>{status}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                {editId === b.id ? (
                                                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <input type="number" min="0" value={editQty} onChange={e => setEditQty(e.target.value)}
                                                            style={{ width: 70, padding: '5px 8px', borderRadius: 6, border: '1px solid #FACC15', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: 13 }}
                                                            onKeyDown={e => e.key === 'Enter' && saveStock(b)} autoFocus />
                                                        <button className="btn btn-primary btn-sm" onClick={() => saveStock(b)}>Save</button>
                                                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>✕</button>
                                                    </div>
                                                ) : (
                                                    <button className="action-btn edit" onClick={() => startEdit(b)} title="Update stock"><FiEdit2 /></button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockManager;
