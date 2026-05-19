import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { FiBook, FiUsers, FiShoppingCart, FiUser, FiTag, FiFilter, FiRotateCw, FiDownload, FiGlobe } from 'react-icons/fi';

const ACTION_META = {
    BOOK_ADDED:           { color: '#4ADE80', icon: <FiBook size={13}/>,         label: 'Book Added' },
    BOOK_UPDATED:         { color: '#60A5FA', icon: <FiBook size={13}/>,         label: 'Book Updated' },
    BOOK_DELETED:         { color: '#F87171', icon: <FiBook size={13}/>,         label: 'Book Deleted' },
    BOOK_RESTORED:        { color: '#C084FC', icon: <FiBook size={13}/>,         label: 'Book Restored' },
    USER_STATUS_TOGGLED:  { color: '#FACC15', icon: <FiUsers size={13}/>,        label: 'User Status Changed' },
    ORDER_STATUS_UPDATED: { color: '#60A5FA', icon: <FiShoppingCart size={13}/>, label: 'Order Updated' },
    AUTHOR_ADDED:         { color: '#4ADE80', icon: <FiUser size={13}/>,         label: 'Author Added' },
    AUTHOR_UPDATED:       { color: '#60A5FA', icon: <FiUser size={13}/>,         label: 'Author Updated' },
    AUTHOR_DELETED:       { color: '#F87171', icon: <FiUser size={13}/>,         label: 'Author Deleted' },
    AUTHOR_RESTORED:      { color: '#C084FC', icon: <FiUser size={13}/>,         label: 'Author Restored' },
    GENRE_ADDED:          { color: '#4ADE80', icon: <FiTag size={13}/>,          label: 'Genre Added' },
    GENRE_UPDATED:        { color: '#60A5FA', icon: <FiTag size={13}/>,          label: 'Genre Updated' },
    GENRE_DELETED:        { color: '#F87171', icon: <FiTag size={13}/>,          label: 'Genre Deleted' },
    PUBLISHER_ADDED:      { color: '#4ADE80', icon: <FiGlobe size={13}/>,        label: 'Publisher Added' },
    PUBLISHER_UPDATED:    { color: '#60A5FA', icon: <FiGlobe size={13}/>,        label: 'Publisher Updated' },
    PUBLISHER_DELETED:    { color: '#F87171', icon: <FiGlobe size={13}/>,        label: 'Publisher Deleted' },
    PUBLISHER_RESTORED:   { color: '#C084FC', icon: <FiGlobe size={13}/>,        label: 'Publisher Restored' },
};

const GROUPS = [
    { key: 'ALL',        label: 'All' },
    { key: 'BOOKS',      label: 'Books' },
    { key: 'AUTHORS',    label: 'Authors' },
    { key: 'GENRES',     label: 'Genres' },
    { key: 'USERS',      label: 'Users' },
    { key: 'ORDERS',     label: 'Orders' },
    { key: 'PUBLISHERS', label: 'Publishers' },
];

const COLOR_GROUPS = { ADD: '#4ADE80', UPDATE: '#60A5FA', DELETE: '#F87171', RESTORE: '#C084FC', OTHER: 'var(--text-light)' };
const getGroupColor = (action) => {
    if (!action) return COLOR_GROUPS.OTHER;
    if (action.includes('ADDED'))    return COLOR_GROUPS.ADD;
    if (action.includes('UPDATED'))  return COLOR_GROUPS.UPDATE;
    if (action.includes('DELETED'))  return COLOR_GROUPS.DELETE;
    if (action.includes('RESTORED')) return COLOR_GROUPS.RESTORE;
    return COLOR_GROUPS.OTHER;
};

const ActivityLog = ({ showToast }) => {
    const [logs, setLogs] = useState([]);
    const [displayed, setDisplayed] = useState([]);
    const [activeGroup, setActiveGroup] = useState('ALL');
    const [loading, setLoading] = useState(true);

    const load = useCallback(() => {
        setLoading(true);
        api.getLogs()
            .then(r => {
                const reversed = [...r.data].reverse();
                setLogs(reversed);
                setDisplayed(reversed);
                setLoading(false);
            })
            .catch(() => { showToast('Failed to load activity log', 'error'); setLoading(false); });
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const applyGroup = (g) => {
        setActiveGroup(g);
        if (g === 'ALL') return setDisplayed(logs);
        const prefix = g.slice(0, -1); // BOOKS→BOOK, AUTHORS→AUTHOR, etc.
        setDisplayed(logs.filter(l => l.action?.startsWith(prefix)));
    };

    const formatTime = (ts) => {
        try {
            const d = new Date(ts);
            return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch { return ts; }
    };

    const getMeta = (action) => ACTION_META[action] || { color: 'var(--text-light)', icon: <FiFilter size={13}/>, label: action };

    const exportCSV = () => {
        const rows = displayed.map(l => `"${l.action}","${l.details}","${l.timestamp}","${l.targetId || ''}"`);
        const csv = 'Action,Details,Timestamp,TargetId\n' + rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'activity_log.csv'; a.click();
        URL.revokeObjectURL(url);
        showToast('Log exported!');
    };

    // Summary counts for action types
    const adds    = logs.filter(l => l.action?.includes('ADDED')).length;
    const updates = logs.filter(l => l.action?.includes('UPDATED')).length;
    const deletes = logs.filter(l => l.action?.includes('DELETED')).length;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Activity Log</h1>
                    <div style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 4 }}>Full audit trail — {logs.length} events (LinkedList, FIFO cap: 500)</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={load}><FiRotateCw /> Refresh</button>
                    <button className="btn btn-primary" onClick={exportCSV}><FiDownload /> Export CSV</button>
                </div>
            </div>

            {/* Type summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Total Events', val: logs.length, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
                    { label: 'Creates', val: adds, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
                    { label: 'Updates', val: updates, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
                    { label: 'Deletes', val: deletes, color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 10, height: 40, borderRadius: 4, background: s.color, flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>{s.val}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Group filter chips */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {GROUPS.map(g => (
                    <button key={g.key} onClick={() => applyGroup(g.key)}
                        style={{
                            padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            border: `1.5px solid ${activeGroup === g.key ? '#FACC15' : 'var(--border-color)'}`,
                            background: activeGroup === g.key ? 'rgba(250,204,21,0.1)' : 'transparent',
                            color: activeGroup === g.key ? '#FACC15' : 'var(--text-muted)',
                            transition: 'all 0.15s'
                        }}>
                        {g.label}
                        {g.key !== 'ALL' && (
                            <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
                                ({logs.filter(l => l.action?.startsWith(g.key.slice(0, -1))).length})
                            </span>
                        )}
                    </button>
                ))}
                <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center', marginLeft: 'auto' }}>
                    {displayed.length} event{displayed.length !== 1 ? 's' : ''} shown
                </span>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {Object.entries(COLOR_GROUPS).map(([k, c]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k[0] + k.slice(1).toLowerCase()}</span>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="loading"><FiRotateCw className="animate-spin" /> Loading activity log...</div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {/* Vertical timeline line */}
                    <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'var(--bg-hover)', zIndex: 0 }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 8 }}>
                        {displayed.length === 0 ? (
                            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>
                                No activity yet for this filter.
                            </div>
                        ) : displayed.map((log, idx) => {
                            const meta = getMeta(log.action);
                            const borderColor = getGroupColor(log.action);
                            return (
                                <div key={log.id || idx}
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '12px 16px', borderRadius: 10, background: 'var(--bg-card)', border: `1px solid var(--bg-hover)`, borderLeft: `3px solid ${borderColor}`, position: 'relative', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>

                                    {/* Timeline dot */}
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${borderColor}18`, border: `2px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: borderColor, flexShrink: 0, zIndex: 1 }}>
                                        {meta.icon}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 10px', borderRadius: 20, background: `${borderColor}18`, color: borderColor, fontSize: 12, fontWeight: 700 }}>
                                                {meta.label || log.action}
                                            </span>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, fontFamily: 'monospace' }}>
                                                {formatTime(log.timestamp)}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4, lineHeight: 1.5 }}>{log.details}</div>
                                        {log.targetId && (
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 3 }}>
                                                ID: {log.targetId}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityLog;
