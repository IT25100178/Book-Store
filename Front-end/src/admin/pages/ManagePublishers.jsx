import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiBook, FiGlobe, FiSearch, FiRotateCcw, FiRotateCw } from 'react-icons/fi';

const EMPTY = { name: '', country: '', website: '', founded: '', bookCount: 0 };

const ManagePublishers = ({ showToast }) => {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [delId, setDelId] = useState(null);
    const [undoVisible, setUndoVisible] = useState(false);

    // Side panel state
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [publisherBooks, setPublisherBooks] = useState([]);
    const [panelOpen, setPanelOpen] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        api.getPublishers()
            .then(r => { setPublishers(r.data); setLoading(false); })
            .catch(() => { showToast('Failed to load publishers', 'error'); setLoading(false); });
    }, [showToast]);

    const openPanel = (publisher) => {
        setSelectedPublisher(publisher);
        setPanelOpen(true);
        api.getPublisherBooks(publisher.id)
            .then(r => setPublisherBooks(r.data))
            .catch(() => setPublisherBooks([]));
    };

    useEffect(() => { load(); }, [load]);

    const handleSearch = () => {
        if (!search.trim()) return load();
        api.searchPublishers(search)
            .then(r => setPublishers(r.data))
            .catch(() => showToast('Search failed', 'error'));
    };

    const openCreate = () => { setEditId(null); setForm(EMPTY); setModal(true); };
    const openEdit = p => { setEditId(p.id); setForm({ ...p }); setModal(true); };

    const save = () => {
        if (!form.name.trim()) return showToast('Name required', 'error');
        const call = editId
            ? api.updatePublisher(editId, { ...form, founded: +form.founded })
            : api.addPublisher({ ...form, founded: +form.founded });
        call.then(() => {
            showToast(editId ? 'Publisher updated!' : 'Publisher added!');
            setModal(false);
            load();
        }).catch(() => showToast('Failed to save publisher', 'error'));
    };

    const del = id => {
        api.deletePublisher(id).then(() => {
            showToast('Publisher deleted');
            if (selectedPublisher?.id === id) setPanelOpen(false);
            setDelId(null);
            setUndoVisible(true);
            setTimeout(() => setUndoVisible(false), 5000);
            load();
        }).catch(() => showToast('Delete failed', 'error'));
    };

    const undo = () => {
        api.undoDeletePublisher().then(() => {
            showToast('Publisher restored!');
            setUndoVisible(false);
            load();
        }).catch(() => showToast('Nothing to undo', 'error'));
    };

    const totalBooks = publishers.reduce((s, p) => s + (p.bookCount || 0), 0);
    const countries = [...new Set(publishers.map(p => p.country).filter(Boolean))].length;

    return (
        <div style={{ display: 'flex', gap: '24px' }}>
            {/* Main Panel */}
            <div style={{ flex: 1 }}>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Manage Publishers</h1>
                        <div style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 4 }}>Manage book publishers and their catalog</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {undoVisible && <button className="btn btn-warning" onClick={undo}><FiRotateCcw /> Undo Delete</button>}
                        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Publisher</button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
                    {[
                        { label: 'Total Publishers', val: publishers.length, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', icon: <FiGlobe /> },
                        { label: 'Total Books Catalogued', val: totalBooks, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', icon: <FiBook /> },
                        { label: 'Countries Represented', val: countries, color: '#FACC15', bg: 'rgba(250,204,21,0.1)', icon: <FiGlobe /> },
                    ].map(s => (
                        <div key={s.label} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 20 }}>{s.icon}</div>
                            <div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>{s.val}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="filter-bar" style={{ marginBottom: 20 }}>
                    <div className="search-group">
                        <input className="search-input" placeholder="Search publisher or country..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                        <button className="search-btn" onClick={handleSearch}><FiSearch /></button>
                    </div>
                    {search && <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); load(); }}>✕ Clear</button>}
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>{publishers.length} publisher{publishers.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiGlobe color="#FACC15" /> Publishers (Insertion Sorted by Name)</span>
                    </div>
                    <div className="table-wrapper">
                        {loading ? (
                            <div className="loading"><FiRotateCw className="animate-spin" /> Loading publishers...</div>
                        ) : (
                            <table>
                                <thead><tr><th>#</th><th>Publisher</th><th>Country</th><th>Website</th><th>Founded</th><th>Books</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                                <tbody>
                                    {publishers.length === 0
                                        ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>No publishers found.</td></tr>
                                        : publishers.map((p, i) => (
                                            <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => openPanel(p)}>
                                                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{i + 1}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(250,204,21,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#FACC15', border: '1px solid rgba(250,204,21,0.2)', flexShrink: 0 }}>
                                                            {p.name?.[0] || '?'}
                                                        </div>
                                                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 14 }}>{p.name}</span>
                                                    </div>
                                                </td>
                                                <td><span style={{ background: 'rgba(96,165,250,0.1)', color: '#60A5FA', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.country || '—'}</span></td>
                                                <td>
                                                    {p.website
                                                        ? <a href={`https://${p.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA', fontSize: 13, textDecoration: 'none' }}>🔗 {p.website}</a>
                                                        : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                                                </td>
                                                <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{p.founded || '—'}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <div style={{ height: 6, width: 80, background: 'var(--border-color)', borderRadius: 3 }}>
                                                            <div style={{ height: '100%', borderRadius: 3, background: '#4ADE80', width: `${Math.min(100, ((p.bookCount || 0) / 150) * 100)}%` }} />
                                                        </div>
                                                        <span style={{ fontWeight: 700, color: '#4ADE80', fontSize: 13 }}>{p.bookCount || 0}</span>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                        <button className="action-btn edit" onClick={() => openEdit(p)}><FiEdit2 /></button>
                                                        <button className="action-btn delete" onClick={() => setDelId(p.id)}><FiTrash2 /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Panel */}
            {panelOpen && selectedPublisher && (
                <div style={{ width: '320px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', height: 'fit-content', position: 'sticky', top: '0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '16px' }}>Publisher Detail</h3>
                        <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '20px' }}><FiX /></button>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(250,204,21,0.1)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FACC15', fontSize: '24px', fontWeight: 800 }}>
                            {selectedPublisher.name?.[0]}
                        </div>
                        <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{selectedPublisher.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{selectedPublisher.country} {selectedPublisher.founded ? `· Est. ${selectedPublisher.founded}` : ''}</p>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><FiBook size={13} /> Published Books ({publisherBooks.length})</h4>
                        {publisherBooks.length === 0
                            ? <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No books in catalog.</p>
                            : publisherBooks.map(b => (
                                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', border: '1px solid #F1F5F9', marginBottom: '6px' }}>
                                    <img src={b.coverImageUrl || 'https://placehold.co/32x44/F3F4F6/94A3B8?text=B'} alt={b.title} style={{ width: '32px', height: '44px', objectFit: 'cover', borderRadius: '3px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{b.title}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>${(b.price || 0).toFixed(2)}</div>
                                    </div>
                                    <button 
                                        className="action-btn edit" 
                                        style={{ padding: '4px', height: '24px', width: '24px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newDesc = window.prompt("Edit Description for " + b.title, b.description || "");
                                            if (newDesc !== null) {
                                                api.updateBook(b.id, { ...b, description: newDesc })
                                                    .then(() => {
                                                        showToast("Description updated");
                                                        // Refresh books in panel
                                                        api.getPublisherBooks(selectedPublisher.id).then(r => setPublisherBooks(r.data));
                                                    });
                                            }
                                        }}
                                    >
                                        <FiEdit2 size={12} />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editId ? 'Edit Publisher' : 'Add Publisher'}</span>
                            <button className="modal-close" onClick={() => setModal(false)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Publisher Name *</label>
                                    <input className="form-control" placeholder="e.g. Penguin Random House" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <input className="form-control" placeholder="e.g. USA" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Year Founded</label>
                                    <input className="form-control" type="number" placeholder="e.g. 1989" value={form.founded} onChange={e => setForm(f => ({ ...f, founded: e.target.value }))} />
                                </div>
                                <div className="form-group full">
                                    <label>Website</label>
                                    <input className="form-control" placeholder="e.g. harpercollins.com" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
                                </div>
                                <div className="form-group full">
                                    <label>Books in Catalog</label>
                                    <input className="form-control" type="number" min="0" placeholder="0" value={form.bookCount} onChange={e => setForm(f => ({ ...f, bookCount: +e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={save}><FiSave /> {editId ? 'Update' : 'Add'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {delId && (
                <div className="modal-overlay" onClick={() => setDelId(null)}>
                    <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title" style={{ color: '#EF4444' }}>Delete Publisher</span>
                            <button className="modal-close" onClick={() => setDelId(null)}><FiX /></button>
                        </div>
                        <div className="modal-body"><p style={{ color: 'var(--text-light)' }}>Permanently remove this publisher? You can undo this action.</p></div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDelId(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => del(delId)}><FiTrash2 /> Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePublishers;
