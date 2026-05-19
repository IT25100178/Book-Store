import React, { useState } from 'react';
import { FiLayout, FiImage, FiSave, FiPlus, FiTrash2, FiCheck, FiArrowUp, FiArrowDown, FiEdit2 } from 'react-icons/fi';

const INITIAL_BANNERS = [
    { id: 1, title: 'Summer Reading Sale', subtitle: 'Up to 40% off on bestsellers this season', badge: 'Limited Time Offer', ctaText: 'Shop Now', ctaLink: '/books', bg: 'linear-gradient(135deg, #1E40AF, #7C3AED)', active: true },
    { id: 2, title: 'New Arrivals — April 2026', subtitle: 'Discover the freshest titles added to our collection', badge: 'New', ctaText: 'Explore', ctaLink: '/new', bg: 'linear-gradient(135deg, #065F46, #0E7490)', active: false },
];

const FEATURED_ROWS = [
    { id: 'bestsellers', label: 'Best Sellers', enabled: true },
    { id: 'newArrivals', label: 'New Arrivals', enabled: true },
    { id: 'topAuthors', label: 'Top Rated Authors', enabled: false },
    { id: 'onSale', label: 'On Sale / Discounted', enabled: true },
    { id: 'recommended', label: 'Staff Recommendations', enabled: false },
];

const EMPTY_BANNER = { title: '', subtitle: '', badge: '', ctaText: 'Shop Now', ctaLink: '/', bg: 'linear-gradient(135deg, #1E40AF, #7C3AED)', active: true };

const ManageCMS = ({ showToast }) => {
    const [tab, setTab] = useState('hero');
    const [banners, setBanners] = useState(INITIAL_BANNERS);
    const [rows, setRows] = useState(FEATURED_ROWS);
    const [announcement, setAnnouncement] = useState('🎉 Free shipping on orders over $50 — Use code FREESHIP at checkout!');
    const [announcementActive, setAnnouncementActive] = useState(true);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_BANNER);
    const [saved, setSaved] = useState(false);

    const openCreate = () => { setEditId(null); setForm(EMPTY_BANNER); setModal(true); };
    const openEdit = b => { setEditId(b.id); setForm({ ...b }); setModal(true); };

    const saveBanner = () => {
        if (!form.title.trim()) return showToast('Title required', 'error');
        if (editId) {
            setBanners(prev => prev.map(b => b.id === editId ? { ...form, id: editId } : b));
            showToast('Banner updated!');
        } else {
            setBanners(prev => [...prev, { ...form, id: Date.now() }]);
            showToast('Banner created!');
        }
        setModal(false);
    };

    const delBanner = id => { setBanners(prev => prev.filter(b => b.id !== id)); showToast('Banner deleted'); };
    const toggleBanner = id => { setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b)); };
    const toggleRow = id => { setRows(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)); showToast('Section updated'); };
    const moveRow = (id, dir) => {
        const idx = rows.findIndex(r => r.id === id);
        const newRows = [...rows];
        const target = idx + dir;
        if (target < 0 || target >= newRows.length) return;
        [newRows[idx], newRows[target]] = [newRows[target], newRows[idx]];
        setRows(newRows);
    };

    const saveAll = () => { setSaved(true); showToast('Storefront changes saved!'); setTimeout(() => setSaved(false), 2000); };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Storefront CMS</h1>
                    <div style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 4 }}>Manage banners, sections, and homepage content</div>
                </div>
                <button className="btn btn-primary" onClick={saveAll} style={{ minWidth: 140 }}>
                    {saved ? <><FiCheck /> Saved!</> : <><FiSave /> Save Changes</>}
                </button>
            </div>

            <div className="tab-group" style={{ marginBottom: 24 }}>
                <button className={`tab-btn ${tab === 'hero' ? 'active' : ''}`} onClick={() => setTab('hero')}>Hero Banners</button>
                <button className={`tab-btn ${tab === 'sections' ? 'active' : ''}`} onClick={() => setTab('sections')}>Homepage Sections</button>
                <button className={`tab-btn ${tab === 'announcement' ? 'active' : ''}`} onClick={() => setTab('announcement')}>Announcement Bar</button>
            </div>

            {tab === 'hero' && (
                <div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" onClick={openCreate}><FiPlus /> Add Banner</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {banners.map(b => (
                            <div key={b.id} className="card" style={{ overflow: 'hidden', opacity: b.active ? 1 : 0.55 }}>
                                <div style={{ height: 100, background: b.bg, display: 'flex', alignItems: 'center', padding: '0 32px', position: 'relative' }}>
                                    <div>
                                        {b.badge && <div style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--text-main)', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 6, display: 'inline-block' }}>{b.badge}</div>}
                                        <div style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: 20 }}>{b.title}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 3 }}>{b.subtitle}</div>
                                    </div>
                                    <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8 }}>
                                        <button onClick={() => toggleBanner(b.id)}
                                            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: 'var(--text-main)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                                            {b.active ? 'Active' : 'Inactive'}
                                        </button>
                                        <button className="action-btn edit" onClick={() => openEdit(b)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'var(--text-main)' }}><FiEdit2 /></button>
                                        <button className="action-btn delete" onClick={() => delBanner(b.id)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FCA5A5' }}><FiTrash2 /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {banners.length === 0 && <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>No banners yet. Click "Add Banner" to create one.</div>}
                    </div>
                </div>
            )}

            {tab === 'sections' && (
                <div className="card">
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiLayout color="#FACC15" /> Homepage Section Order</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Drag or use arrows to reorder · toggle to show/hide</span>
                    </div>
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {rows.map((row, idx) => (
                            <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, border: `1px solid ${row.enabled ? 'rgba(250,204,21,0.25)' : 'var(--border-color)'}`, background: row.enabled ? 'rgba(250,204,21,0.04)' : 'var(--bg-card)', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <button onClick={() => moveRow(row.id, -1)} disabled={idx === 0}
                                        style={{ background: 'none', border: 'none', color: idx === 0 ? 'var(--border-color)' : 'var(--text-light)', cursor: idx === 0 ? 'default' : 'pointer', padding: 2, display: 'flex' }}><FiArrowUp size={12} /></button>
                                    <button onClick={() => moveRow(row.id, 1)} disabled={idx === rows.length - 1}
                                        style={{ background: 'none', border: 'none', color: idx === rows.length - 1 ? 'var(--border-color)' : 'var(--text-light)', cursor: idx === rows.length - 1 ? 'default' : 'pointer', padding: 2, display: 'flex' }}><FiArrowDown size={12} /></button>
                                </div>
                                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>{idx + 1}</span>
                                <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: row.enabled ? 'var(--bg-main)' : 'var(--text-muted)' }}>{row.label}</span>
                                <button onClick={() => toggleRow(row.id)}
                                    style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: row.enabled ? '#FACC15' : 'var(--border-color)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: row.enabled ? '#000' : 'var(--bg-card)', position: 'absolute', top: 3, left: row.enabled ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'announcement' && (
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: '#FACC15', display: 'flex', alignItems: 'center', gap: 8 }}><FiLayout /> Announcement Bar</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ padding: '12px 20px', background: announcementActive ? '#1E40AF' : 'var(--bg-card)', borderRadius: 8, textAlign: 'center', fontSize: 13, color: announcementActive ? 'var(--bg-card)' : 'var(--text-muted)', border: `1px solid ${announcementActive ? '#3B82F6' : 'var(--border-color)'}`, transition: 'all 0.2s' }}>
                            {announcement || 'No announcement set'}
                        </div>
                        <div className="form-group">
                            <label>Announcement Text</label>
                            <input className="form-control" value={announcement} onChange={e => setAnnouncement(e.target.value)} placeholder="e.g. 🎉 Free shipping on orders over $50!" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 10, border: `1px solid ${announcementActive ? 'rgba(74,222,128,0.3)' : 'var(--border-color)'}` }}>
                            <div>
                                <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>Show Announcement Bar</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Display at the top of the storefront</div>
                            </div>
                            <button onClick={() => setAnnouncementActive(!announcementActive)}
                                style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: announcementActive ? '#4ADE80' : 'var(--border-color)', position: 'relative', transition: 'background 0.2s' }}>
                                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-card)', position: 'absolute', top: 3, left: announcementActive ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner Modal */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editId ? 'Edit Banner' : 'Create Banner'}</span>
                            <button className="modal-close" onClick={() => setModal(false)}><FiImage /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Title *</label>
                                    <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Summer Sale" />
                                </div>
                                <div className="form-group full">
                                    <label>Subtitle</label>
                                    <input className="form-control" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. Up to 40% off..." />
                                </div>
                                <div className="form-group">
                                    <label>Badge Text</label>
                                    <input className="form-control" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. New, Sale, Hot" />
                                </div>
                                <div className="form-group">
                                    <label>CTA Button Text</label>
                                    <input className="form-control" value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} />
                                </div>
                                <div className="form-group full">
                                    <label>Background Gradient (CSS)</label>
                                    <input className="form-control" value={form.bg} onChange={e => setForm(f => ({ ...f, bg: e.target.value }))} placeholder="e.g. linear-gradient(135deg, #1E40AF, #7C3AED)" />
                                </div>
                                <div className="form-group full" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ flex: 1, height: 40, borderRadius: 8, background: form.bg }} />
                                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Preview</span>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select className="form-control" value={form.active ? 'Active' : 'Inactive'} onChange={e => setForm(f => ({ ...f, active: e.target.value === 'Active' }))}>
                                        <option>Active</option><option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={saveBanner}><FiSave /> {editId ? 'Update' : 'Create'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCMS;
