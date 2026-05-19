import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import SearchUtil from '../utils/SearchUtil';
import { FiSearch, FiX, FiShield, FiUser, FiRotateCw, FiCheckCircle, FiMinusCircle, FiBook, FiEdit2 } from 'react-icons/fi';

const ManageUsers = ({ showToast }) => {
    const [users, setUsers] = useState([]);
    const [displayed, setDisplayed] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Side panel state
    const [selectedUser, setSelectedUser] = useState(null);
    const [orderedBooks, setOrderedBooks] = useState([]);
    const [panelOpen, setPanelOpen] = useState(false);

    const loadUsers = () => {
        setLoading(true);
        api.getUsers()
            .then(res => { setUsers(res.data); setDisplayed(res.data); setLoading(false); })
            .catch(() => { showToast("Failed to load users", "error"); setLoading(false); });
    };

    useEffect(() => { loadUsers(); }, []);

    const openPanel = (user) => {
        setSelectedUser(user);
        setPanelOpen(true);
        api.getUserOrderedBooks(user.id)
            .then(r => setOrderedBooks(r.data))
            .catch(() => setOrderedBooks([]));
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) { setDisplayed(users); return; }
        // DSA: Linear Search via SearchUtil
        const results = SearchUtil.linearSearch(users, 'name', searchTerm);
        setDisplayed(results);
        if (results.length === 0) showToast("No users found", "error");
    };

    const toggleStatus = (id) => {
        api.toggleUserStatus(id)
            .then(res => { showToast(`User ${res.data.status === 'ACTIVE' ? 'activated' : 'banned'}`); loadUsers(); })
            .catch(() => showToast("Failed to update status", "error"));
    };

    return (
        <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
                <div className="page-header">
                    <h1 className="page-title">Manage Users</h1>
                    <span style={{fontSize:'13px',color:'var(--text-light)'}}>{displayed.length} user{displayed.length !== 1 ? 's' : ''} shown</span>
                </div>

                <div className="filter-bar">
                    <div className="search-group">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name (Linear Search)..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="search-btn" onClick={handleSearch}><FiSearch /></button>
                    </div>
                    {searchTerm && (
                        <button className="btn btn-secondary btn-sm" onClick={() => { setSearchTerm(''); setDisplayed(users); }}><FiX /> Clear</button>
                    )}
                </div>

                <div className="card">
                    <div className="table-wrapper">
                        {loading ? (
                            <div className="loading"><FiRotateCw className="animate-spin" /> Loading users...</div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayed.length === 0 ? (
                                        <tr><td colSpan="5" style={{textAlign:'center',padding:'40px',color:'var(--text-light)'}}>No users found.</td></tr>
                                    ) : displayed.map(user => (
                                        <tr key={user.id} style={{ cursor: 'pointer' }} onClick={() => openPanel(user)}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width:'36px',height:'36px',borderRadius:'50%',background:'#DBEAFE',color:'#1E40AF',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'13px' }}>
                                                        {user.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span style={{fontWeight:600}}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td style={{color:'var(--text-muted)'}}>{user.email}</td>
                                            <td>
                                                <span style={{
                                                    display:'inline-flex', alignItems:'center', gap:'4px',
                                                    fontWeight: user.role === 'ADMIN' ? 700 : 400,
                                                    color: user.role === 'ADMIN' ? '#4338CA' : 'var(--text-muted)'
                                                }}>
                                                    {user.role === 'ADMIN' ? <FiShield size={14}/> : <FiUser size={14}/>} {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ display:'inline-flex', alignItems:'center', gap:'4px' }} className={`badge ${user.status === 'ACTIVE' ? 'badge-active' : 'badge-banned'}`}>
                                                    {user.status === 'ACTIVE' ? <FiCheckCircle size={12}/> : <FiMinusCircle size={12}/>} {user.status}
                                                </span>
                                            </td>
                                            <td onClick={e => e.stopPropagation()}>
                                                {user.role !== 'ADMIN' ? (
                                                    <button
                                                        onClick={() => toggleStatus(user.id)}
                                                        className={`btn btn-sm ${user.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`}
                                                    >
                                                        {user.status === 'ACTIVE' ? 'Ban' : 'Activate'}
                                                    </button>
                                                ) : (
                                                    <span style={{fontSize:'12px',color:'var(--border-color)',fontStyle:'italic'}}>Protected</span>
                                                )}
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
            {panelOpen && selectedUser && (
                <div style={{ width: '320px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', height: 'fit-content', position: 'sticky', top: '0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '16px' }}>User Profile</h3>
                        <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '20px' }}><FiX /></button>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#DBEAFE', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E40AF', fontSize: '24px', fontWeight: 700 }}>
                            {selectedUser.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{selectedUser.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{selectedUser.email}</p>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><FiBook size={13} /> Ordered Books ({orderedBooks.length})</h4>
                        {orderedBooks.length === 0
                            ? <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No orders yet.</p>
                            : orderedBooks.map(b => (
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
                                                        api.getUserOrderedBooks(selectedUser.id).then(r => setOrderedBooks(r.data));
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
        </div>
    );
};

export default ManageUsers;
