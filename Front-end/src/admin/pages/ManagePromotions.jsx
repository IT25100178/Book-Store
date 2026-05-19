import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPercent, FiX, FiSave, FiTag, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { api } from '../services/api';

const EMPTY = { code: '', type: 'Percentage', value: '', minOrder: '', expiry: '', status: 'Active', maxUses: '' };

const ManagePromotions = ({ showToast }) => {
    const [promos, setPromos] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [delId, setDelId] = useState(null);

    useEffect(() => {
        loadPromotions();
    }, []);

    const loadPromotions = async () => {
        try {
            const { data } = await api.getPromotions();
            setPromos(data || []);
        } catch (e) {
            console.error(e);
            showToast('Failed to load promotions', 'error');
        }
    };

    const shown = promos.filter(p =>
        p.code.toLowerCase().includes(search.toLowerCase()) &&
        (filterStatus === 'ALL' || p.status === filterStatus)
    );

    const openCreate = () => { setEditId(null); setForm(EMPTY); setModal(true); };
    const openEdit = p => { setEditId(p.id); setForm({ ...p }); setModal(true); };

    const save = async () => {
        if (!form.code.trim()) return showToast('Code required', 'error');
        if (!form.expiry) return showToast('Expiry required', 'error');
        try {
            if (editId) {
                await api.updatePromotion(editId, { ...form, id: editId });
                showToast('Promotion updated!');
            } else {
                await api.addPromotion({ ...form, usage: 0, value: +form.value, minOrder: +form.minOrder, maxUses: +form.maxUses });
                showToast('Promotion created!');
            }
            setModal(false);
            loadPromotions();
        } catch (e) {
            console.error(e);
            showToast('Failed to save promotion', 'error');
        }
    };

    const del = async id => { 
        try {
            await api.deletePromotion(id);
            setDelId(null); 
            showToast('Deleted');
            loadPromotions();
        } catch(e) {
            console.error(e);
            showToast('Failed to delete promotion', 'error');
        }
    };

    const toggleStatus = async p => {
        try {
            await api.updatePromotion(p.id, { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' });
            showToast('Status updated');
            loadPromotions();
        } catch (e) {
            console.error(e);
            showToast('Failed to update status', 'error');
        }
    };

    const valDisplay = p => p.type === 'Percentage' ? `${p.value}% OFF` : p.type === 'Fixed Amount' ? `$${p.value} OFF` : 'Free Shipping';

    const stats = [
        { label: 'Total Codes', val: promos.length, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
        { label: 'Active Codes', val: promos.filter(p => p.status === 'Active').length, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
        { label: 'Total Redemptions', val: promos.reduce((s, p) => s + p.usage, 0), color: '#FACC15', bg: 'rgba(250,204,21,0.1)' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Discounts & Promotions</h1>
                    <div style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: 4 }}>Manage promo codes and seasonal sales</div>
                </div>
                <button className="btn btn-primary" id="create-promotion-btn" onClick={openCreate}><FiPlus /> Create Promotion</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
                {stats.map(s => (
                    <div key={s.label} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: s.color }}><FiPercent /></div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>{s.val}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="filter-bar">
                <div className="search-group">
                    <input className="search-input" placeholder="Search code..." value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="search-btn"><FiTag /></button>
                </div>
                <div className="tab-group">
                    {['ALL', 'Active', 'Inactive', 'Expired'].map(s => (
                        <button key={s} className={`tab-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
                    ))}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{shown.length} result{shown.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiPercent color="#FACC15" /> Promo Codes</span>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Code</th><th>Type</th><th>Discount</th><th>Min Order</th><th>Expires</th><th>Usage</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                        <tbody>
                            {shown.length === 0
                                ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>No promotions found.</td></tr>
                                : shown.map(p => (
                                    <tr key={p.id}>
                                        <td><span style={{ fontWeight: 700, color: '#FACC15', fontFamily: 'monospace', fontSize: 13, background: 'rgba(250,204,21,0.08)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(250,204,21,0.2)' }}>{p.code}</span></td>
                                        <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{p.type}</td>
                                        <td style={{ color: '#4ADE80', fontWeight: 700 }}>{valDisplay(p)}</td>
                                        <td style={{ color: 'var(--text-light)' }}>{p.minOrder > 0 ? `$${p.minOrder}` : '—'}</td>
                                        <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{p.expiry}</td>
                                        <td>
                                            <div style={{ fontSize: 12 }}>
                                                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{p.usage}</span>
                                                <span style={{ color: 'var(--text-muted)' }}> / {p.maxUses}</span>
                                            </div>
                                            <div style={{ marginTop: 4, height: 4, background: 'var(--border-color)', borderRadius: 2, width: 80 }}>
                                                <div style={{ height: '100%', borderRadius: 2, background: '#FACC15', width: `${Math.min(100, (p.usage / p.maxUses) * 100)}%` }} />
                                            </div>
                                        </td>
                                        <td>
                                            <button onClick={() => toggleStatus(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: p.status === 'Active' ? '#4ADE80' : 'var(--text-light)' }}>
                                                {p.status === 'Active' ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}{p.status}
                                            </button>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button className="action-btn edit" onClick={() => openEdit(p)}><FiEdit2 /></button>
                                                <button className="action-btn delete" onClick={() => setDelId(p.id)}><FiTrash2 /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editId ? 'Edit Promotion' : 'Create Promotion'}</span>
                            <button className="modal-close" onClick={() => setModal(false)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Promo Code *</label>
                                    <input className="form-control" placeholder="e.g. SUMMER20" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
                                </div>
                                <div className="form-group">
                                    <label>Discount Type</label>
                                    <select className="form-control" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                        <option>Percentage</option><option>Fixed Amount</option><option>Free Shipping</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{form.type === 'Percentage' ? 'Discount %' : form.type === 'Fixed Amount' ? 'Amount ($)' : 'N/A'}</label>
                                    <input className="form-control" type="number" min="0" placeholder="e.g. 20" disabled={form.type === 'Free Shipping'} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Min Order ($)</label>
                                    <input className="form-control" type="number" min="0" placeholder="0 = none" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Max Uses</label>
                                    <input className="form-control" type="number" min="1" placeholder="e.g. 500" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Expiry Date *</label>
                                    <input className="form-control" type="date" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                        <option>Active</option><option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={save}><FiSave /> {editId ? 'Update' : 'Create'}</button>
                        </div>
                    </div>
                </div>
            )}

            {delId && (
                <div className="modal-overlay" onClick={() => setDelId(null)}>
                    <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title" style={{ color: '#EF4444' }}>Delete Promotion</span>
                            <button className="modal-close" onClick={() => setDelId(null)}><FiX /></button>
                        </div>
                        <div className="modal-body"><p style={{ color: 'var(--text-light)' }}>Permanently delete this promo code? This cannot be undone.</p></div>
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

export default ManagePromotions;
