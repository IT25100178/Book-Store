import React, { useState } from 'react';
import { FiPlus, FiShield, FiEdit2, FiTrash2, FiX, FiSave, FiCheck, FiMinus } from 'react-icons/fi';

const ROLES = ['Super Admin', 'Content Editor', 'Order Manager', 'Viewer'];

const PERMISSIONS = [
    { key: 'viewDashboard',   label: 'View Dashboard' },
    { key: 'manageBooks',     label: 'Manage Books' },
    { key: 'manageAuthors',   label: 'Manage Authors' },
    { key: 'manageGenres',    label: 'Manage Genres' },
    { key: 'manageOrders',    label: 'Manage Orders' },
    { key: 'manageUsers',     label: 'Manage Users' },
    { key: 'managePromotions',label: 'Manage Promotions' },
    { key: 'manageReviews',   label: 'Moderate Reviews' },
    { key: 'manageCMS',       label: 'Edit CMS / Storefront' },
    { key: 'manageRoles',     label: 'Manage Roles (RBAC)' },
    { key: 'manageSettings',  label: 'System Settings' },
    { key: 'viewLogs',        label: 'View Activity Logs' },
];

const DEFAULT_PERMS = {
    'Super Admin':    Object.fromEntries(PERMISSIONS.map(p => [p.key, true])),
    'Content Editor': Object.fromEntries(PERMISSIONS.map(p => [p.key, ['viewDashboard','manageBooks','manageAuthors','manageGenres','manageCMS','manageReviews'].includes(p.key)])),
    'Order Manager':  Object.fromEntries(PERMISSIONS.map(p => [p.key, ['viewDashboard','manageOrders','manageUsers','viewLogs'].includes(p.key)])),
    'Viewer':         Object.fromEntries(PERMISSIONS.map(p => [p.key, ['viewDashboard','viewLogs'].includes(p.key)])),
};

const INITIAL_STAFF = [
    { id: 1, name: 'Admin Avatar', email: 'admin@luxurybooks.com', role: 'Super Admin', status: 'Active', joined: '2024-01-10' },
    { id: 2, name: 'John Editor', email: 'john@luxurybooks.com', role: 'Content Editor', status: 'Active', joined: '2025-03-15' },
    { id: 3, name: 'Alice Orders', email: 'alice@luxurybooks.com', role: 'Order Manager', status: 'Active', joined: '2025-07-01' },
    { id: 4, name: 'Sam Viewer', email: 'sam@luxurybooks.com', role: 'Viewer', status: 'Inactive', joined: '2025-11-20' },
];

const EMPTY_STAFF = { name: '', email: '', role: 'Content Editor', status: 'Active' };

const roleColor = role => {
    const map = { 'Super Admin': '#FACC15', 'Content Editor': '#60A5FA', 'Order Manager': '#4ADE80', 'Viewer': 'var(--text-light)' };
    return map[role] || 'var(--text-light)';
};
const roleBg = role => {
    const map = { 'Super Admin': 'rgba(250,204,21,0.1)', 'Content Editor': 'rgba(96,165,250,0.1)', 'Order Manager': 'rgba(74,222,128,0.1)', 'Viewer': 'rgba(148,163,184,0.1)' };
    return map[role] || 'rgba(148,163,184,0.1)';
};

const ManageRoles = ({ showToast }) => {
    const [staff, setStaff] = useState(INITIAL_STAFF);
    const [perms, setPerms] = useState(DEFAULT_PERMS);
    const [tab, setTab] = useState('staff');
    const [selectedRole, setSelectedRole] = useState('Content Editor');
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_STAFF);
    const [delId, setDelId] = useState(null);

    const openCreate = () => { setEditId(null); setForm(EMPTY_STAFF); setModal(true); };
    const openEdit = s => { setEditId(s.id); setForm({ ...s }); setModal(true); };

    const save = () => {
        if (!form.name.trim() || !form.email.trim()) return showToast('Name & email required', 'error');
        if (editId) {
            setStaff(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s));
            showToast('Staff updated!');
        } else {
            setStaff(prev => [...prev, { ...form, id: Date.now(), joined: new Date().toISOString().split('T')[0] }]);
            showToast('Staff member added!');
        }
        setModal(false);
    };

    const del = id => { setStaff(prev => prev.filter(s => s.id !== id)); setDelId(null); showToast('Removed'); };

    const togglePerm = (role, key) => {
        if (role === 'Super Admin') return showToast('Super Admin permissions cannot be modified', 'error');
        setPerms(prev => ({ ...prev, [role]: { ...prev[role], [key]: !prev[role][key] } }));
        showToast('Permission updated');
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Role-Based Access Control</h1>
                    <div style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 4 }}>Manage staff accounts and role permissions</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {tab === 'staff' && <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Staff</button>}
                </div>
            </div>

            <div className="tab-group" style={{ marginBottom: 24 }}>
                <button className={`tab-btn ${tab === 'staff' ? 'active' : ''}`} onClick={() => setTab('staff')}>Staff Directory</button>
                <button className={`tab-btn ${tab === 'perms' ? 'active' : ''}`} onClick={() => setTab('perms')}>Role Permissions</button>
            </div>

            {tab === 'staff' && (
                <div className="card">
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiShield color="#FACC15" /> Staff Members ({staff.length})</span>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                            <tbody>
                                {staff.map(s => (
                                    <tr key={s.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: '50%', background: roleBg(s.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: roleColor(s.role), border: `1px solid ${roleColor(s.role)}40` }}>
                                                    {s.name[0]}
                                                </div>
                                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{s.email}</td>
                                        <td>
                                            <span style={{ background: roleBg(s.role), color: roleColor(s.role), padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${roleColor(s.role)}40` }}>
                                                {s.role}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{s.joined}</td>
                                        <td><span className={`badge ${s.status === 'Active' ? 'badge-active' : 'badge-banned'}`}>{s.status}</span></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button className="action-btn edit" onClick={() => openEdit(s)}><FiEdit2 /></button>
                                                <button className="action-btn delete" onClick={() => setDelId(s.id)}><FiTrash2 /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'perms' && (
                <div>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        {ROLES.map(r => (
                            <button key={r} onClick={() => setSelectedRole(r)}
                                style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${selectedRole === r ? roleColor(r) : 'var(--border-color)'}`, background: selectedRole === r ? roleBg(r) : 'transparent', color: selectedRole === r ? roleColor(r) : 'var(--text-light)', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}>
                                {r}
                            </button>
                        ))}
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiShield color={roleColor(selectedRole)} /> {selectedRole} Permissions
                            </span>
                            {selectedRole === 'Super Admin' && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>All permissions locked</span>}
                        </div>
                        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {PERMISSIONS.map(p => {
                                const enabled = perms[selectedRole]?.[p.key];
                                return (
                                    <div key={p.key} onClick={() => togglePerm(selectedRole, p.key)}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: `1px solid ${enabled ? roleColor(selectedRole) + '40' : 'var(--border-color)'}`, background: enabled ? roleBg(selectedRole) : 'var(--bg-card)', cursor: selectedRole === 'Super Admin' ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
                                        <span style={{ fontSize: 14, fontWeight: 500, color: enabled ? 'var(--bg-main)' : 'var(--text-muted)' }}>{p.label}</span>
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: enabled ? roleColor(selectedRole) : 'var(--border-color)', transition: 'all 0.15s' }}>
                                            {enabled ? <FiCheck size={13} color="#000" /> : <FiMinus size={13} color="#64748B" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editId ? 'Edit Staff Member' : 'Add Staff Member'}</span>
                            <button className="modal-close" onClick={() => setModal(false)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Full Name *</label>
                                    <input className="form-control" placeholder="e.g. Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="form-group full">
                                    <label>Email *</label>
                                    <input className="form-control" type="email" placeholder="e.g. jane@luxurybooks.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                                        {ROLES.map(r => <option key={r}>{r}</option>)}
                                    </select>
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
                            <button className="btn btn-primary" onClick={save}><FiSave /> {editId ? 'Update' : 'Add'}</button>
                        </div>
                    </div>
                </div>
            )}

            {delId && (
                <div className="modal-overlay" onClick={() => setDelId(null)}>
                    <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title" style={{ color: '#EF4444' }}>Remove Staff Member</span>
                            <button className="modal-close" onClick={() => setDelId(null)}><FiX /></button>
                        </div>
                        <div className="modal-body"><p style={{ color: 'var(--text-light)' }}>Remove this staff member and revoke their access? This cannot be undone.</p></div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDelId(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => del(delId)}><FiTrash2 /> Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRoles;
