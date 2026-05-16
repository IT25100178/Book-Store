import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import { FiPlus, FiSearch, FiX, FiEdit2, FiTrash2, FiRotateCcw, FiBook, FiChevronRight } from 'react-icons/fi';

// ── Manage Authors Page ──────────────────────────────────────────────────────
const ManageAuthors = ({ showToast }) => {
    const [authors, setAuthors] = useState([]);
    const [displayed, setDisplayed] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [undoVisible, setUndoVisible] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);

    // Side panel state
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [authorBooks, setAuthorBooks] = useState([]);
    const [panelOpen, setPanelOpen] = useState(false);

    const searchDebounce = useRef(null);

    const load = useCallback(() => {
        setLoading(true);
        api.getAuthors()
            .then(r => { setAuthors(r.data); setDisplayed(r.data); setLoading(false); })
            .catch(() => { showToast('Failed to load authors', 'error'); setLoading(false); });
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    // DSA: Trie-powered live search — debounced API call
    const handleSearchChange = (val) => {
        setSearchTerm(val);
        clearTimeout(searchDebounce.current);
        if (!val.trim()) { setDisplayed(authors); return; }
        searchDebounce.current = setTimeout(() => {
            api.searchAuthors(val)
                .then(r => setDisplayed(r.data))
                .catch(() => setDisplayed([]));
        }, 200);
    };

    const openPanel = (author) => {
        setSelectedAuthor(author);
        setPanelOpen(true);
        api.getAuthorBooks(author.id)
            .then(r => setAuthorBooks(r.data))
            .catch(() => setAuthorBooks([]));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this author?')) return;
        api.deleteAuthor(id).then(() => {
            showToast('Author deleted — undo available for 5s');
            setUndoVisible(true);
            setTimeout(() => setUndoVisible(false), 5000);
            load();
            if (selectedAuthor?.id === id) setPanelOpen(false);
        }).catch(() => showToast('Error deleting author', 'error'));
    };

    const handleUndo = () => {
        api.undoDeleteAuthor().then(() => { showToast('Author restored'); setUndoVisible(false); load(); })
            .catch(() => showToast('Nothing to undo', 'error'));
    };

    const handleSave = (data) => {
        const call = data.id ? api.updateAuthor(data.id, data) : api.addAuthor(data);
        call.then(() => { showToast(data.id ? 'Author updated' : 'Author added'); setIsModalOpen(false); load(); })
            .catch(() => showToast('Error saving author', 'error'));
    };

    return (
        <div style={{ display: 'flex', gap: '24px' }}>
            {/* Main Panel */}
            <div style={{ flex: 1 }}>
                <div className="page-header">
                    <h1 className="page-title">Manage Authors</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {undoVisible && <button className="btn btn-warning" onClick={handleUndo}><FiRotateCcw /> Undo Delete</button>}
                        <button className="btn btn-primary" onClick={() => { setEditingAuthor(null); setIsModalOpen(true); }}><FiPlus /> Add Author</button>
                    </div>
                </div>

                <div className="filter-bar">
                    <div className="search-group">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Live Trie search — type a name prefix..."
                            value={searchTerm}
                            onChange={e => handleSearchChange(e.target.value)}
                        />
                        <button className="search-btn"><FiSearch /></button>
                    </div>
                    {searchTerm && <button className="btn btn-secondary btn-sm" onClick={() => { setSearchTerm(''); setDisplayed(authors); }}><FiX /> Clear</button>}
                </div>

                <div className="card">
                    <div className="table-wrapper">
                        {loading ? <div className="loading">Loading authors...</div> : (
                            <table>
                                <thead><tr><th>Author</th><th>Nationality</th><th>Birth Year</th><th>Books</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {displayed.length === 0
                                        ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No authors found.</td></tr>
                                        : displayed.map(a => (
                                            <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => openPanel(a)}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            {a.profileImageBase64
                                                                ? <img src={a.profileImageBase64} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                : <span style={{ fontWeight: 700, fontSize: '14px', color: '#1E40AF' }}>{a.name?.substring(0, 2).toUpperCase()}</span>}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{a.name}</div>
                                                            <div style={{ fontSize: '12px', color: 'var(--text-light)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.bio}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)' }}>{a.nationality || '—'}</td>
                                                <td style={{ color: 'var(--text-muted)' }}>{a.birthYear || '—'}</td>
                                                <td><span className="badge badge-category">{a.bookIds?.length || 0} books</span></td>
                                                <td onClick={e => e.stopPropagation()}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="action-btn edit" onClick={() => { setEditingAuthor(a); setIsModalOpen(true); }} title="Edit"><FiEdit2 /></button>
                                                        <button className="action-btn delete" onClick={() => handleDelete(a.id)} title="Delete"><FiTrash2 /></button>
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

            {/* Author Detail Side Panel */}
            {panelOpen && selectedAuthor && (
                <div style={{ width: '320px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', height: 'fit-content', position: 'sticky', top: '0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '16px' }}>Author Profile</h3>
                        <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '20px' }}><FiX /></button>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DBEAFE', margin: '0 auto 12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selectedAuthor.profileImageBase64
                                ? <img src={selectedAuthor.profileImageBase64} alt={selectedAuthor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontWeight: 800, fontSize: '24px', color: '#1E40AF' }}>{selectedAuthor.name?.substring(0, 2).toUpperCase()}</span>}
                        </div>
                        <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{selectedAuthor.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{selectedAuthor.nationality} {selectedAuthor.birthYear ? `· b. ${selectedAuthor.birthYear}` : ''}</p>
                    </div>
                    {selectedAuthor.bio && (
                        <div style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', padding: '12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                            {selectedAuthor.bio}
                        </div>
                    )}
                    <div>
                        <h4 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><FiBook size={13} /> Books by this Author ({authorBooks.length})</h4>
                        {authorBooks.length === 0
                            ? <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No books linked.</p>
                            : authorBooks.map(b => (
                                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', border: '1px solid #F1F5F9', marginBottom: '6px' }}>
                                    <img src={b.coverImageUrl || 'https://placehold.co/32x44/DBEAFE/1E40AF?text=B'} alt={b.title} style={{ width: '32px', height: '44px', objectFit: 'cover', borderRadius: '3px' }} />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{b.title}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>${(b.price || 0).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <AuthorModal author={editingAuthor} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
};

// ── Author Add/Edit Modal ───────────────────────────────────────────────────
const AuthorModal = ({ author, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: author?.name || '',
        bio: author?.bio || '',
        nationality: author?.nationality || '',
        birthYear: author?.birthYear || '',
        profileImageBase64: author?.profileImageBase64 || '',
        bookIds: author?.bookIds || [],
    });
    const fileRef = useRef(null);

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setForm(prev => ({ ...prev, profileImageBase64: reader.result }));
        reader.readAsDataURL(file);
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onSave({ ...author, ...form, birthYear: parseInt(form.birthYear) || 0 });
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">{author ? 'Edit Author' : 'Add Author'}</span>
                    <button className="modal-close" onClick={onClose}><FiX /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }} onClick={() => fileRef.current.click()}>
                                {form.profileImageBase64
                                    ? <img src={form.profileImageBase64} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ color: '#1E40AF', fontWeight: 700, fontSize: '22px' }}>{form.name?.substring(0, 2).toUpperCase() || '?'}</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click the avatar to upload a profile photo</p>
                            </div>
                        </div>
                        <div className="form-grid">
                            <div className="form-group"><label>Name *</label><input name="name" value={form.name} onChange={handleChange} className="form-control" required /></div>
                            <div className="form-group"><label>Nationality</label><input name="nationality" value={form.nationality} onChange={handleChange} className="form-control" /></div>
                            <div className="form-group full"><label>Birth Year</label><input name="birthYear" type="number" value={form.birthYear} onChange={handleChange} className="form-control" /></div>
                            <div className="form-group full"><label>Biography</label><textarea name="bio" value={form.bio} onChange={handleChange} className="form-control" rows="4" /></div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Author</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageAuthors;
