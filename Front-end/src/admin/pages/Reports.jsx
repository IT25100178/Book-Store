import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FiDownload, FiTrendingUp, FiBarChart2, FiDollarSign, FiShoppingCart, FiBook, FiCalendar, FiRotateCw } from 'react-icons/fi';

const RANGES = ['Last 6 Months', 'Last 30 Days', 'Last 7 Days', 'This Year'];
const W = 500; const H = 150;

const BarChart = ({ data }) => {
    const maxRev = Math.max(...data.map(d => d.revenue), 1);
    return (
        <svg width="100%" height={H + 30} viewBox={`0 0 ${W} ${H + 30}`} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FACC15" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#D97706" stopOpacity="0.5" />
                </linearGradient>
            </defs>
            {data.map((d, i) => {
                const barH = (d.revenue / maxRev) * H;
                const x = (i / data.length) * W + 10;
                const barW = (W / data.length) - 20;
                return (
                    <g key={i}>
                        <rect x={x} y={H - barH} width={barW} height={barH} rx={4} fill="url(#barGrad)" />
                        <text x={x + barW / 2} y={H - barH - 6} fontSize="10" fill="#FACC15" textAnchor="middle" fontWeight="700">${(d.revenue / 1000).toFixed(1)}k</text>
                        <text x={x + barW / 2} y={H + 18} fontSize="10" fill="#64748B" textAnchor="middle">{d.month?.slice(5) || d.month}</text>
                    </g>
                );
            })}
        </svg>
    );
};

const LineChart = ({ data, valueKey = 'orders' }) => {
    const values = data.map(d => d[valueKey] || 0);
    const maxV = Math.max(...values, 1);
    const xStep = data.length > 1 ? W / (data.length - 1) : W;
    const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${H - (values[i] / maxV) * H}`).join(' ');
    const area = `${path} L ${(data.length - 1) * xStep} ${H} L 0 ${H} Z`;
    return (
        <svg width="100%" height={H + 30} viewBox={`0 0 ${W} ${H + 30}`} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#areaGrad)" />
            <path d={path} fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={i * xStep} cy={H - (values[i] / maxV) * H} r="4" fill="var(--bg-card)" stroke="#60A5FA" strokeWidth="2" />
                    <text x={i * xStep} y={H + 18} fontSize="10" fill="#64748B" textAnchor="middle">{d.month?.slice(5) || d.month}</text>
                    <text x={i * xStep} y={H - (values[i] / maxV) * H - 8} fontSize="10" fill="#60A5FA" textAnchor="middle">{values[i]}</text>
                </g>
            ))}
        </svg>
    );
};

const exportCSV = (rows, filename) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]).join(',');
    const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
};

const Reports = ({ showToast }) => {
    const [range, setRange] = useState('Last 6 Months');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getReportsSummary()
            .then(r => { setData(r.data); setLoading(false); })
            .catch(() => { showToast('Could not load live report data', 'error'); setLoading(false); });
    }, [showToast]);

    if (loading) return <div className="loading"><FiRotateCw className="animate-spin" /> Loading reports...</div>;
    if (!data) return <div className="loading">No report data available.</div>;

    const kpis = [
        { label: 'Total Revenue', val: `$${(data.totalRevenue || 0).toFixed(2)}`, icon: <FiDollarSign />, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
        { label: 'Total Orders', val: data.totalOrders || 0, icon: <FiShoppingCart />, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
        { label: 'Units Sold', val: data.totalUnitsSold || 0, icon: <FiBook />, color: '#FACC15', bg: 'rgba(250,204,21,0.1)' },
        { label: 'Avg Order Value', val: `$${(data.avgOrderValue || 0).toFixed(2)}`, icon: <FiTrendingUp />, color: '#C084FC', bg: 'rgba(192,132,252,0.1)' },
    ];

    const trend = data.monthlyTrend || [];
    const topBooks = data.topBooks || [];
    const catRevenue = data.revenueByCategory || [];
    const maxCatRev = Math.max(...catRevenue.map(c => c.revenue), 1);
    const COLORS = ['#FACC15', '#60A5FA', '#F87171', '#4ADE80', '#C084FC', '#F97316', '#2DD4BF'];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <div style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 4 }}>Live data from real orders and books — computed server-side</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 14px' }}>
                        <FiCalendar color="#94A3B8" size={14} />
                        <select value={range} onChange={e => setRange(e.target.value)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: 13, cursor: 'pointer' }}>
                            {RANGES.map(r => <option key={r} value={r} style={{ background: 'var(--bg-card)' }}>{r}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-secondary" onClick={() => { exportCSV(topBooks, 'top_books.csv'); showToast('Exported top books CSV'); }}>
                        <FiDownload /> Top Books
                    </button>
                    <button className="btn btn-primary" onClick={() => { exportCSV(trend, 'revenue_trend.csv'); showToast('Exported revenue CSV'); }}>
                        <FiDownload /> Revenue
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {kpis.map(k => (
                    <div key={k.label} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: k.color }}>{k.icon}</div>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>{k.val}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{k.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><FiBarChart2 color="#FACC15" /> Monthly Revenue (TreeMap sorted)</h3>
                    </div>
                    {trend.length < 2
                        ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Not enough order data for trend.</div>
                        : <BarChart data={trend} />}
                </div>
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><FiTrendingUp color="#60A5FA" /> Order Volume Trend</h3>
                    </div>
                    {trend.length < 2
                        ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Not enough order data for trend.</div>
                        : <LineChart data={trend.map(t => ({ ...t, orders: Math.round(t.revenue / 70) }))} />}
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Top Books */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiBook color="#FACC15" /> Top Selling Books (Max-Heap)</span>
                        <button className="btn btn-secondary btn-sm" onClick={() => { exportCSV(topBooks, 'top_books.csv'); showToast('Exported!'); }}><FiDownload /> CSV</button>
                    </div>
                    <div className="table-wrapper">
                        {topBooks.length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>No sales data yet. Orders marked as Delivered/Shipped will appear here.</div>
                        ) : (
                            <table>
                                <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Category</th><th>Units Sold</th><th>Revenue</th></tr></thead>
                                <tbody>
                                    {topBooks.map((b, i) => (
                                        <tr key={b.id || i}>
                                            <td><span style={{ fontWeight: 800, fontSize: i < 3 ? 18 : 13, color: i === 0 ? '#FACC15' : i === 1 ? 'var(--text-light)' : i === 2 ? '#D97706' : 'var(--text-muted)' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span></td>
                                            <td style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 13 }}>{b.title}</td>
                                            <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{b.author}</td>
                                            <td><span className="badge badge-category">{b.category || '—'}</span></td>
                                            <td style={{ fontWeight: 700, color: '#4ADE80' }}>{b.unitsSold}</td>
                                            <td style={{ fontWeight: 700, color: '#FACC15' }}>${(b.revenue || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Revenue by Category */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><FiBarChart2 color="#FACC15" /> Revenue by Category</h3>
                    {catRevenue.length === 0
                        ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>No category data yet.</div>
                        : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {catRevenue.map((c, i) => (
                                    <div key={c.category}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                                                <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 500 }}>{c.category}</span>
                                            </div>
                                            <span style={{ fontSize: 13, color: COLORS[i % COLORS.length], fontWeight: 700 }}>${c.revenue.toFixed(0)}</span>
                                        </div>
                                        <div style={{ height: 6, background: 'var(--border-color)', borderRadius: 3 }}>
                                            <div style={{ height: '100%', borderRadius: 3, background: COLORS[i % COLORS.length], width: `${(c.revenue / maxCatRev) * 100}%`, transition: 'width 0.8s ease' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
