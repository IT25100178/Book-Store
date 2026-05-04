import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiLink } from 'react-icons/fi';

const PRESET_COLORS = ['#3B82F6','#8B5CF6','#EC4899','#10B981','#F59E0B','#EF4444','#14B8A6','#6366F1','#F97316','#84CC16'];

const ManageGenres = ({ showToast }) => {
    const [genres, setGenres] = useState([]);
    const [mostConnected, setMostConnected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);
    const [relatedGenres, setRelatedGenres] = useState({});

    const load = useCallback(() => {
        setLoading(true);
        Promise.all([api.getGenres(), api.getMostConnectedGenre().catch(() => ({ data: null }))])
            .then(([genresRes, mostRes]) => {
                setGenres(genresRes.data);
                setMostConnected(mostRes.data);
                setLoading(false);
            })
            .catch(() => { showToast('Failed to load genres', 'error'); setLoading(false); });
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const handleRelated = (id) => {
        if (relatedGenres[id]) { setRelatedGenres(prev => { const n = {...prev}; delete n[id]; return n; }); return; }
        api.getRelatedGenres(id)
            .then(r => setRelatedGenres(prev => ({ ...prev, [id]: r.data })))
            .catch(() => showToast('Could not fetch related genres', 'error'));
    };

    const handleSave = (data) => {
        const call = data.id ? api.updateGenre(data.id, data) : api.addGenre(data);
        call.then(() => { showToast(data.id ? 'Genre updated' : 'Genre added'); setIsModalOpen(false); load(); })
            .catch(() => showToast('Error saving genre', 'error'));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this genre?')) return;
        api.deleteGenre(id).then(() => { showToast('Genre deleted'); load(); })
            .catch(() => showToast('Error deleting genre', 'error'));
    };

    if (loading) return <div className="loading">Loading genres...</div>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Manage Genres</h1>
                <button className="btn btn-primary" onClick={() => { setEditingGenre(null); setIsModalOpen(true); }}><FiPlus /> Add Genre</button>
            </div>

            {mostConnected && (
                <div style={{ marginBottom: '20px', padding: '16px 20px', background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', borderRadius: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FiStar size={20} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>Most Connected Genre: {mostConnected.name}</div>
                        <div style={{ fontSize: '13px', opacity: 0.85 }}>This genre shares books with the most other genres (highest graph degree)</div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {genres.length === 0
                    ? <div style={{ color: 'var(--text-light)', padding: '40px' }}>No genres yet. Add one!</div>
                    : genres.map(genre => (
                        <div key={genre.id} className="card" style={{ padding: '20px', borderTop: `4px solid ${genre.colorTag || '#3B82F6'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: genre.colorTag || '#3B82F6', marginRight: '8px' }}></span>
                                    <span style={{ fontWeight: 700, fontSize: '16px' }}>{genre.name}</span>
                                    {mostConnected?.id === genre.id && <span style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 7px', background: '#FEF3C7', color: '#D97706', borderRadius: '20px', fontWeight: 600 }}>Top Connected</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
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
                                    onClick={() => handleRelated(genre.id)}
                                >
                                    <FiLink size={12} /> {relatedGenres[genre.id] ? 'Hide' : 'Related'}
                                </button>
                            </div>

                            {relatedGenres[genre.id] && (
                                <div style={{ marginTop: '12px', padding: '10px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '6px' }}>RELATED GENRES (BFS within 2 hops)</div>
                                    {relatedGenres[genre.id].length === 0
                                        ? <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No relationships found</span>
                                        : relatedGenres[genre.id].map(rg => (
                                            <span key={rg.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '2px 4px 2px 0', padding: '3px 8px', borderRadius: '12px', background: rg.colorTag + '22', color: rg.colorTag, border: `1px solid ${rg.colorTag}44`, fontSize: '12px', fontWeight: 600 }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rg.colorTag }}></span>
                                                {rg.name}
                                            </span>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
            </div>

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
