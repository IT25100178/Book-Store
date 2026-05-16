import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiLogOut, FiSearch, FiBook, FiUser, FiUsers, FiTag, FiShoppingCart, FiX, FiBell, FiAlertTriangle, FiPackage, FiSun, FiMoon } from 'react-icons/fi';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ toggleSidebar, theme, toggleTheme }) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // ─── Notifications ───────────────────────────────────────────────────
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notifRef = useRef(null);

    useEffect(() => {
        api.getDashboardStats()
            .then(r => {
                const d = r.data;
                const notifs = [];
                const pending = (d.topPendingOrders || []).length;
                if (pending > 0) notifs.push({ id: 'orders', icon: 'order', text: `${pending} pending order${pending > 1 ? 's' : ''} awaiting action`, path: '/admin/orders' });
                const low = (d.lowStockBooks || []);
                if (low.length > 0) notifs.push({ id: 'stock', icon: 'stock', text: `${low.length} book${low.length > 1 ? 's' : ''} running low on stock`, path: '/admin/stock' });
                setNotifications(notifs);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Command + K listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (searchOpen && inputRef.current) inputRef.current.focus();
    }, [searchOpen]);

    // Live search
    useEffect(() => {
        if (!query.trim()) {
            setResults(null);
            return;
        }
        setLoading(true);
        const timer = setTimeout(() => {
            fetch(`http://localhost:8080/api/admin/search?q=${encodeURIComponent(query)}`)
                .then(r => r.json())
                .then(data => { setResults(data); setLoading(false); })
                .catch(() => { setResults(null); setLoading(false); });
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleNavigate = (path) => {
        navigate(path);
        setSearchOpen(false);
        setQuery('');
    };

    const hasResults = results && (
        results.books?.length > 0 || results.authors?.length > 0 || 
        results.genres?.length > 0 || results.users?.length > 0 || 
        results.orders?.length > 0
    );

    return (
        <div className="topbar">
            <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FiMenu />
                </button>
                <div 
                    onClick={() => setSearchOpen(true)}
                    style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-light)', cursor: 'pointer', width: '300px', fontSize: '13px' }}
                >
                    <FiSearch /> <span>Search everything...</span>
                    <span style={{ marginLeft: 'auto', background: 'var(--bg-card)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 600 }}>Ctrl K</span>
                </div>
            </div>
            <div className="topbar-right">
                {/* Notification Bell */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                    <button onClick={() => setNotifOpen(o => !o)}
                        style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: notifications.length > 0 ? '#FACC15' : 'var(--text-light)', position: 'relative', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}>
                        <FiBell size={18} />
                        {notifications.length > 0 && (
                            <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: '#EF4444', border: '2px solid var(--bg-card)' }} />
                        )}
                    </button>
                    {notifOpen && (
                        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: 320, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 999, overflow: 'hidden' }}>
                            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>Notifications</span>
                                {notifications.length > 0 && <span style={{ fontSize: 11, background: '#EF4444', color: 'var(--text-main)', borderRadius: 20, padding: '2px 8px', fontWeight: 700 }}>{notifications.length}</span>}
                            </div>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '30px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>All clear — no alerts!</div>
                            ) : notifications.map(n => (
                                <div key={n.id} onClick={() => { navigate(n.path); setNotifOpen(false); }}
                                    style={{ padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: '1px solid var(--bg-hover)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8, background: n.icon === 'stock' ? 'rgba(250,204,21,0.1)' : 'rgba(96,165,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.icon === 'stock' ? '#FACC15' : '#60A5FA', flexShrink: 0 }}>
                                        {n.icon === 'stock' ? <FiAlertTriangle size={16} /> : <FiShoppingCart size={16} />}
                                    </div>
                                    <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '20px', display: 'flex' }} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
                        {theme === 'light' ? <FiMoon /> : <FiSun />}
                    </button>
                    <div className="avatar">AA</div>
                    <div>
                        <div className="admin-name">Admin Avatar</div>
                        <div className="admin-role">Administrator</div>
                    </div>
                </div>
                <button className="btn-logout"><FiLogOut /> Logout</button>
            </div>

            {/* Global Search Command Palette */}
            {searchOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '10vh' }}>
                    <div ref={searchRef} style={{ width: '600px', background: 'var(--bg-card)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <FiSearch size={20} color="#94A3B8" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search books, authors, users..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px', background: 'transparent', color: 'var(--text-main)' }}
                            />
                            <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}><FiX size={20} /></button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                            {loading && <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>Searching across multi-index HashMaps...</div>}
                            
                            {!loading && query && !hasResults && (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No results found.</div>
                            )}

                            {!loading && results && (
                                <>
                                    {results.books?.length > 0 && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ padding: '4px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Books</div>
                                            {results.books.map(b => (
                                                <div key={b.id} onClick={() => handleNavigate('/admin/books')} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} className="search-result">
                                                    <FiBook color="#3B82F6" /> <span>{b.title} <span style={{ color: 'var(--text-light)', fontSize: '12px' }}>by {b.author}</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {results.authors?.length > 0 && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ padding: '4px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authors (Trie Match)</div>
                                            {results.authors.map(a => (
                                                <div key={a.id} onClick={() => handleNavigate('/admin/authors')} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} className="search-result">
                                                    <FiUser color="#8B5CF6" /> <span>{a.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {results.genres?.length > 0 && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ padding: '4px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Genres</div>
                                            {results.genres.map(g => (
                                                <div key={g.id} onClick={() => handleNavigate('/admin/genres')} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} className="search-result">
                                                    <FiTag color={g.colorTag || '#10B981'} /> <span>{g.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {results.orders?.length > 0 && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ padding: '4px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Orders</div>
                                            {results.orders.map(o => (
                                                <div key={o.id} onClick={() => handleNavigate('/admin/orders')} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} className="search-result">
                                                    <FiShoppingCart color="#F59E0B" /> <span>Order {o.id} <span style={{ color: 'var(--text-light)', fontSize: '12px' }}>— {o.status}</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {results.users?.length > 0 && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ padding: '4px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Users</div>
                                            {results.users.map(u => (
                                                <div key={u.id} onClick={() => handleNavigate('/admin/users')} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} className="search-result">
                                                    <FiUsers color="#EC4899" /> <span>{u.name} <span style={{ color: 'var(--text-light)', fontSize: '12px' }}>({u.email})</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopBar;
