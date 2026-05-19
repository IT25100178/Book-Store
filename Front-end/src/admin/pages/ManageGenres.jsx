import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiLink, FiBook } from 'react-icons/fi';

const PRESET_COLORS = ['#3B82F6','#8B5CF6','#EC4899','#10B981','#F59E0B','#EF4444','#14B8A6','#6366F1','#F97316','#84CC16'];

const ManageGenres = ({ showToast }) => {
    const [genres, setGenres] = useState([]);
    const [mostConnected, setMostConnected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);
    const [relatedGenres, setRelatedGenres] = useState({});

    // Side panel state
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [genreBooks, setGenreBooks] = useState([]);
    const [panelOpen, setPanelOpen] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        Promise.all([
            api.getGenres().catch(() => ({ data: [] })), 
            api.getMostConnectedGenre().catch(() => ({ data: null }))
        ])
            .then(([genresRes, mostRes]) => {
                setGenres(Array.isArray(genresRes.data) ? genresRes.data : []);
                setMostConnected(mostRes && mostRes.data ? mostRes.data : null);
                setLoading(false);
            })
            .catch((err) => { 
                console.error("Genre load error:", err);
                showToast('Failed to load genres', 'error'); 
                setLoading(false); 
            });
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const handleRelated = (id) => {
        if (relatedGenres[id]) { 
            setRelatedGenres(prev => { 
                const n = {...prev}; 
                delete n[id]; 
                return n; 
            }); 
            return; 
        }
        api.getRelatedGenres(id)
            .then(r => {
                setRelatedGenres(prev => ({ ...prev, [id]: Array.isArray(r.data) ? r.data : [] }));
            })
            .catch(() => showToast('Could not fetch related genres', 'error'));
    };

    const openPanel = (genre) => {
        setSelectedGenre(genre);
        setPanelOpen(true);
        api.getGenreBooks(genre.id)
            .then(r => setGenreBooks(r.data))
            .catch(() => setGenreBooks([]));
    };

    const handleSave = (data) => {
        const call = data.id ? api.updateGenre(data.id, data) : api.addGenre(data);
        call.then(() => { 
            showToast(data.id ? 'Genre updated' : 'Genre added'); 
            setIsModalOpen(false); 
            load(); 
        }).catch(() => showToast('Error saving genre', 'error'));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this genre?')) return;
        api.deleteGenre(id).then(() => { 
            showToast('Genre deleted'); 
            if (selectedGenre?.id === id) setPanelOpen(false);
            load(); 
        }).catch(() => showToast('Error deleting genre', 'error'));
    };

    if (loading) return <div className="loading">Loading genres...</div>;

    return (
        <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
                <div className="page-header">
                    <h1 className="page-title">Manage Genres</h1>
                    <button className="btn btn-primary" onClick={() => { setEditingGenre(null); setIsModalOpen(true); }}><FiPlus /> Add Genre</button>
                </div>

                {mostConnected && mostConnected.name && (
                    <div style={{ marginBottom: '20px', padding: '16px 20px', background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', borderRadius: '12px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
                        <FiStar size={20} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>Most Connected Genre: {mostConnected.name}</div>
                            <div style={{ fontSize: '13px', opacity: 0.9 }}>This genre shares books with the most other genres.</div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {genres.length === 0
                        ? <div style={{ color: 'var(--text-light)', padding: '40px', gridColumn: '1/-1', textAlign: 'center' }}>No genres yet. Add one!</div>
                        : genres.map(genre => (
                            <div key={genre.id} className="card" style={{ padding: '20px', borderTop: `4px solid ${genre.colorTag || '#3B82F6'}`, cursor: 'pointer' }} onClick={() => openPanel(genre)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: genre.colorTag || '#3B82F6', marginRight: '8px' }}></span>
                                        <span style={{ fontWeight: 700, fontSize: '16px' }}>{genre.name}</span>
                                        {mostConnected?.id === genre.id && <span style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 7px', background: '#FEF3C7', color: '#D97706', borderRadius: '20px', fontWeight: 600 }}>Top Connected</span>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                                        <button className="action-btn edit" onClick={() => { setEditingGenre(genre); setIsModalOpen(true); }}><FiEdit2 /></button>
                                        <button className="action-btn delete" onClick={() => handleDelete(genre.id)}><FiTrash2 /></button>
                                    </div>
                                </div>

                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', minHeight: '38px', lineHeight: '1.6' }}>{genre.description || 'No description.'}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="badge badge-category">{genre.bookIds?.length || 0} books</span>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                                        onClick={(e) => { e.stopPropagation(); handleRelated(genre.id); }}
                                    >
                                        <FiLink size={12} /> {relatedGenres[genre.id] ? 'Hide' : 'Related'}
                                    </button>
                                </div>

                                {relatedGenres[genre.id] && (
                                    <div style={{ marginTop: '12px', padding: '10px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '6px' }}>RELATED GENRES</div>
                                        {relatedGenres[genre.id].length === 0
                                            ? <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No relationships found</span>
                                            : relatedGenres[genre.id].map(rg => (
                                                <span key={rg.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '2px 4px 2px 0', padding: '3px 8px', borderRadius: '12px', background: (rg.colorTag || '#94A3B8') + '22', color: rg.colorTag || '#94A3B8', border: `1px solid ${(rg.colorTag || '#94A3B8')}44`, fontSize: '11px', fontWeight: 600 }}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rg.colorTag || '#94A3B8' }}></span>
                                                    {rg.name}
                                                </span>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>

            {/* Side Panel */}
            {panelOpen && selectedGenre && (
                <div style={{ width: '320px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', height: 'fit-content', position: 'sticky', top: '0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '16px' }}>Genre Detail</h3>
                        <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '20px' }}><FiX /></button>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: (selectedGenre.colorTag || '#3B82F6') + '22', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedGenre.colorTag || '#3B82F6', fontSize: '24px' }}>
                            <FiLink />
                        </div>
                        <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{selectedGenre.name}</h2>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><FiBook size={13} /> Books in Genre ({genreBooks.length})</h4>
                        {genreBooks.length === 0
                            ? <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No books in this genre.</p>
                            : genreBooks.map(b => (
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
                                                        api.getGenreBooks(selectedGenre.id).then(r => setGenreBooks(r.data));
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

            {isModalOpen && (
                <GenreModal genre={editingGenre} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
};

const GenreModal = ({ genre, onClose, onSave }) => {
    const [form, setForm] = useState({ name: genre?.name || '', description: genre?.description || '', colorTag: genre?.colorTag || '#3B82F6' });
    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = e => { e.preventDefault(); if (!form.name.trim()) return; onSave({ ...genre, ...form }); };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">{genre ? 'Edit Genre' : 'Add Genre'}</span>
                    <button className="modal-close" onClick={onClose}><FiX /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group"><label>Genre Name *</label><input name="name" value={form.name} onChange={handleChange} className="form-control" required /></div>
                        <div className="form-group" style={{ marginTop: '12px' }}>
                            <label>Color Tag</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {PRESET_COLORS.map(c => (
                                    <div key={c} onClick={() => setForm(p => ({ ...p, colorTag: c }))} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, cursor: 'pointer', border: form.colorTag === c ? '3px solid #1E293B' : '3px solid transparent', transition: 'border 0.15s' }} />
                                ))}
                                <input type="color" value={form.colorTag} onChange={e => setForm(p => ({ ...p, colorTag: e.target.value }))} style={{ width: '28px', height: '28px', padding: '0', border: 'none', borderRadius: '50%', cursor: 'pointer' }} />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '12px' }}>
                            <label>Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows="3" />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ background: form.colorTag }}>Save Genre</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageGenres;
