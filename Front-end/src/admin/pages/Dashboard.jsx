import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiShoppingCart, FiDollarSign, FiLoader, FiAlertCircle, FiClock, FiAlertTriangle, FiEdit2 } from 'react-icons/fi';

const Dashboard = ({ showToast }) => {
    const [stats, setStats] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.getDashboardStats()
            .then(res => { setStats(res.data); setLoading(false); })
            .catch(() => { showToast("Failed to load dashboard data", "error"); setLoading(false); });

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [showToast]);

    if (loading) return <div className="loading"><FiLoader className="animate-spin" /> Loading dashboard...</div>;
    if (!stats) return <div className="loading"><FiAlertCircle /> No data available.</div>;

    const statCards = [
        { label: 'Total Books', value: stats.totalBooks, icon: <FiBookOpen />, cls: 'blue' },
        { label: 'Total Users', value: stats.totalUsers, icon: <FiUsers />, cls: 'indigo' },
        { label: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingCart />, cls: 'teal' },
        { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: <FiDollarSign />, cls: 'green' },
    ];

    // SVG Line Graph calculation
    const sparklineData = stats.revenueTrend || [];
    const maxRev = Math.max(...sparklineData.map(d => d.revenue), 100);
    const minRev = Math.min(...sparklineData.map(d => d.revenue), 0);
    const sparkWidth = 400; const sparkHeight = 150;
    const generatePath = () => {
        if (sparklineData.length < 2) return '';
        const xStep = sparkWidth / (sparklineData.length - 1);
        const yRatio = sparkHeight / (maxRev - minRev || 1);
        return sparklineData.map((d, i) => {
            const x = i * xStep;
            const y = sparkHeight - ((d.revenue - minRev) * yRatio);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    // SVG Pie Graph calculation
    const generatePie = () => {
        const dist = stats.genreDistribution || [];
        if (dist.length === 0) return null;
        let total = dist.reduce((sum, item) => sum + item.count, 0);
        let currentAngle = 0;

        return dist.map((item, i) => {
            const angle = (item.count / total) * 360;
            const x1 = 100 + 80 * Math.cos(Math.PI * currentAngle / 180);
            const y1 = 100 + 80 * Math.sin(Math.PI * currentAngle / 180);
            currentAngle += angle;
            const x2 = 100 + 80 * Math.cos(Math.PI * currentAngle / 180);
            const y2 = 100 + 80 * Math.sin(Math.PI * currentAngle / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            // Handle 100% case
            if (angle === 360) {
                return <circle key={i} cx="100" cy="100" r="80" fill="transparent" stroke={item.color} strokeWidth="40" />
            }

            const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
            ].join(' ');

            return <path key={i} d={pathData} fill={item.color} title={`${item.name}: ${item.count}`} />;
        });
    };

    return (
        <div>
            <div className="page-header" style={{ alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginTop: '4px' }}>
                        <FiClock /> {currentTime.toLocaleString()}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to="/admin/books" className="btn btn-primary">Add Book</Link>
                    <Link to="/admin/orders" className="btn btn-secondary">View All Orders</Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="stat-grid">
                {statCards.map(card => (
                    <div key={card.label} className="stat-card">
                        <div className={`stat-icon ${card.cls}`}>{card.icon}</div>
                        <div>
                            <div className="stat-value">{card.value}</div>
                            <div className="stat-label">{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Revenue Trend SVG */}
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>Revenue Trend (Last 6 Months)</h3>
                    {sparklineData.length === 0 ? (
                        <div style={{ color: 'var(--text-light)', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No revenue data.</div>
                    ) : (
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <svg width="100%" height={sparkHeight} viewBox={`0 -10 ${sparkWidth} ${sparkHeight + 20}`} style={{ overflow: 'visible' }}>
                                <path d={generatePath()} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                                {sparklineData.map((d, i) => {
                                    const x = i * (sparkWidth / (sparklineData.length - 1));
                                    const y = sparkHeight - ((d.revenue - minRev) * (sparkHeight / (maxRev - minRev || 1)));
                                    return (
                                        <g key={i}>
                                            <circle cx={x} cy={y} r="4" fill="var(--bg-card)" stroke="#3B82F6" strokeWidth="2" />
                                            <text x={x} y={y - 12} fontSize="10" fill="#64748B" textAnchor="middle">${d.revenue.toFixed(0)}</text>
                                            <text x={x} y={sparkHeight + 15} fontSize="10" fill="#94A3B8" textAnchor="middle">{d.month}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    )}
                </div>

                {/* Genre Distribution Pie Chart */}
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', alignSelf: 'flex-start' }}>Genre Distribution</h3>
                    {(!stats.genreDistribution || stats.genreDistribution.length === 0) ? (
                        <div style={{ color: 'var(--text-light)', flex: 1, display: 'flex', alignItems: 'center' }}>No genres.</div>
                    ) : (
                        <>
                            <svg width="200" height="200" viewBox="0 0 200 200">
                                {generatePie()}
                                <circle cx="100" cy="100" r="50" fill="var(--bg-card)" />
                            </svg>
                            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {stats.genreDistribution.map(g => (
                                    <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: g.color }}></div>
                                        {g.name} ({g.count})
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px' }}>
                {/* Orders & Low Stock Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Top Pending Orders */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Top Pending Orders <small style={{fontWeight:400,color:'var(--text-light)',fontSize:'13px'}}>(Priority Queue)</small></span>
                            <Link to="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr><th>Order ID</th><th>Date</th><th>Price</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {(!stats.topPendingOrders || stats.topPendingOrders.length === 0) ? (
                                        <tr><td colSpan="4" style={{textAlign:'center',color:'var(--text-light)',padding:'30px'}}>No pending orders.</td></tr>
                                    ) : (
                                        stats.topPendingOrders.map(order => (
                                            <tr key={order.id} className="tr-pending">
                                                <td style={{fontFamily:'monospace',fontSize:'12px',color:'var(--text-muted)'}}>{order.id}</td>
                                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                                <td style={{fontWeight:600}}>${(order.totalPrice || 0).toFixed(2)}</td>
                                                <td><span className="badge badge-pending">{order.status}</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="card" style={{ border: '1px solid #FECACA' }}>
                        <div className="card-header" style={{ borderBottom: '1px solid #FEE2E2', background: '#FEF2F2' }}>
                            <span className="card-title" style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiAlertTriangle /> Low Stock Alert
                            </span>
                            <span style={{ fontSize: '13px', color: '#EF4444' }}>Below 5 remaining</span>
                        </div>
                        <div style={{ padding: '16px' }}>
                            {(!stats.lowStockBooks || stats.lowStockBooks.length === 0) ? (
                                <div style={{ color: '#059669', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    Inventory levels are healthy.
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {stats.lowStockBooks.map(b => (
                                        <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-card)', border: '1px solid #FCA5A5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={b.coverImageUrl || 'https://placehold.co/32x44/FEE2E2/DC2626?text=B'} alt="" style={{ width: '32px', height: '44px', objectFit: 'cover', borderRadius: '4px' }} />
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#7F1D1D' }}>{b.title}</div>
                                                    <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>{b.stockQuantity} in stock</div>
                                                </div>
                                            </div>
                                            <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#DC2626', border: 'none' }} onClick={() => navigate('/admin/books')}>
                                                <FiEdit2 /> Update
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>Top 5 Best-Selling Books</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {(!stats.bestSellers || stats.bestSellers.length === 0) ? (
                            <div style={{ color: 'var(--text-light)' }}>No sales data.</div>
                        ) : (
                            stats.bestSellers.map((b, idx) => {
                                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                                const medalSize = idx < 3 ? '24px' : '14px';
                                return (
                                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '32px', textAlign: 'center', fontSize: medalSize, fontWeight: 700, color: 'var(--text-light)' }}>
                                            {medal}
                                        </div>
                                        <img src={b.coverImageUrl || 'https://placehold.co/40x56/DBEAFE/1E40AF?text=B'} alt={b.title} style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>{b.title}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ color: '#10B981', fontWeight: 700 }}>{b.sales}</span> units sold
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
