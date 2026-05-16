import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import SearchUtil from '../utils/SearchUtil';
import { FiSearch, FiX, FiShield, FiUser, FiRotateCw, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

const ManageUsers = ({ showToast }) => {
    const [users, setUsers] = useState([]);
    const [displayed, setDisplayed] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const loadUsers = () => {
        setLoading(true);
        api.getUsers()
            .then(res => { setUsers(res.data); setDisplayed(res.data); setLoading(false); })
            .catch(() => { showToast("Failed to load users", "error"); setLoading(false); });
    };

    useEffect(() => { loadUsers(); }, []);

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
        <div>
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
                                    <tr key={user.id}>
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
                                        <td>
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
    );
};

export default ManageUsers;
