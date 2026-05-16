import React, { useState } from 'react';
import { FiStar, FiCheck, FiX, FiMessageSquare, FiSearch, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';

const INITIAL_REVIEWS = [
    { id: 1, book: 'The Great Gatsby', user: 'Athy Fernando', rating: 5, comment: 'Absolutely brilliant masterpiece! Fitzgerald captures the essence of the American Dream perfectly. A must-read for everyone.', date: '2026-04-20', status: 'Pending' },
    { id: 2, book: '1984', user: 'John Doe', rating: 4, comment: 'Very thought provoking. Orwell\'s vision of a dystopian future feels more relevant than ever today.', date: '2026-04-18', status: 'Approved' },
    { id: 3, book: 'Dune', user: 'Spammer123', rating: 1, comment: 'Buy cheap watches at shady-link.com! Best deals!!!', date: '2026-04-17', status: 'Hidden' },
    { id: 4, book: 'To Kill a Mockingbird', user: 'Sarah W.', rating: 5, comment: 'A timeless classic. Atticus Finch is one of literature\'s greatest heroes.', date: '2026-04-15', status: 'Approved' },
    { id: 5, book: 'Pride and Prejudice', user: 'Emily Clarke', rating: 4, comment: 'Jane Austen\'s wit shines through every page. Darcy is unforgettable!', date: '2026-04-12', status: 'Pending' },
    { id: 6, book: 'The Hobbit', user: 'Tom B.', rating: 3, comment: 'Good adventure story but felt slow at times. Still a classic.', date: '2026-04-10', status: 'Approved' },
];

const Stars = ({ rating }) => (
    <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
            <FiStar key={i} size={13} color={i < rating ? '#FACC15' : 'var(--border-color)'} fill={i < rating ? '#FACC15' : 'transparent'} />
        ))}
    </div>
);

const ManageReviews = ({ showToast }) => {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterRating, setFilterRating] = useState('ALL');
    const [replyId, setReplyId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const shown = reviews.filter(r => {
        const matchSearch = r.book.toLowerCase().includes(search.toLowerCase()) || r.user.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
        const matchRating = filterRating === 'ALL' || r.rating === Number(filterRating);
        return matchSearch && matchStatus && matchRating;
    });

    const approve = id => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
        showToast('Review approved');
    };
    const hide = id => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Hidden' } : r));
        showToast('Review hidden');
    };
    const del = id => {
        setReviews(prev => prev.filter(r => r.id !== id));
        showToast('Review deleted');
    };
    const submitReply = id => {
        if (!replyText.trim()) return showToast('Reply cannot be empty', 'error');
        setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText } : r));
        setReplyId(null);
        setReplyText('');
        showToast('Reply saved!');
    };

    const counts = {
        all: reviews.length,
        pending: reviews.filter(r => r.status === 'Pending').length,
        approved: reviews.filter(r => r.status === 'Approved').length,
        hidden: reviews.filter(r => r.status === 'Hidden').length,
    };

    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reviews & Ratings Moderation</h1>
                    <div style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 4 }}>Approve, hide, or respond to customer reviews</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '10px 20px' }}>
                    <FiStar size={20} color="#FACC15" fill="#FACC15" />
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#FACC15', lineHeight: 1 }}>{avgRating}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Avg Rating</div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Pending Review', val: counts.pending, color: '#FACC15', bg: 'rgba(250,204,21,0.1)' },
                    { label: 'Approved', val: counts.approved, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
                    { label: 'Hidden (Flagged)', val: counts.hidden, color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 18 }}>
                            <FiMessageSquare />
                        </div>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>{s.val}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <div className="search-group">
                    <input className="search-input" placeholder="Search book or user..." value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="search-btn"><FiSearch /></button>
                </div>
                <div className="tab-group">
                    {['ALL', 'Pending', 'Approved', 'Hidden'].map(s => (
                        <button key={s} className={`tab-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s} {s !== 'ALL' ? `(${counts[s.toLowerCase()]})` : ''}</button>
                    ))}
                </div>
                <select className="sort-select" value={filterRating} onChange={e => setFilterRating(e.target.value)}>
                    <option value="ALL">All Stars</option>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star</option>)}
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {shown.length === 0 ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>No reviews match your filters.</div>
                ) : shown.map(r => (
                    <div key={r.id} className="card" style={{ padding: 20, borderLeft: r.status === 'Pending' ? '4px solid #FACC15' : r.status === 'Hidden' ? '4px solid #EF4444' : '4px solid #4ADE80' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#FACC15', border: '1px solid var(--border-color)' }}>
                                        {r.user[0]}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>{r.user}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>on <span style={{ color: '#60A5FA' }}>{r.book}</span> · {r.date}</div>
                                    </div>
                                    <Stars rating={r.rating} />
                                    <span className={`badge ${r.status === 'Approved' ? 'badge-active' : r.status === 'Pending' ? 'badge-pending' : 'badge-banned'}`}>{r.status}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, cursor: 'pointer', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: expandedId === r.id ? 'unset' : 2, overflow: 'hidden' }}
                                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                                    {r.comment}
                                </p>
                                {r.reply && (
                                    <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(96,165,250,0.08)', borderRadius: 8, border: '1px solid rgba(96,165,250,0.2)', fontSize: 13, color: 'var(--text-light)' }}>
                                        <strong style={{ color: '#60A5FA' }}>Admin Reply:</strong> {r.reply}
                                    </div>
                                )}
                                {replyId === r.id && (
                                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                                        <input className="form-control" style={{ flex: 1 }} placeholder="Write a reply..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                                        <button className="btn btn-primary btn-sm" onClick={() => submitReply(r.id)}>Send</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setReplyId(null)}>Cancel</button>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                                {r.status !== 'Approved' && (
                                    <button className="action-btn edit" title="Approve" onClick={() => approve(r.id)} style={{ color: '#4ADE80' }}><FiCheck /></button>
                                )}
                                <button className="action-btn edit" title="Reply" onClick={() => { setReplyId(r.id); setReplyText(r.reply || ''); }} style={{ color: '#60A5FA' }}><FiMessageSquare /></button>
                                {r.status !== 'Hidden' && (
                                    <button className="action-btn" title="Hide" onClick={() => hide(r.id)} style={{ color: '#FACC15', border: '1px solid var(--border-color)' }}><FiEyeOff /></button>
                                )}
                                <button className="action-btn delete" title="Delete" onClick={() => del(r.id)}><FiX /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageReviews;
