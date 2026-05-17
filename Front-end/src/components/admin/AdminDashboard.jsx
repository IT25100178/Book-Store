// src/components/admin/AdminDashboard.jsx
// Member 7 – Vishahan | Redesigned with premium dark UI
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { admin as adminApi, books as booksApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/Luxury books logo.png';
import './AdminDashboard.css';

const SECTIONS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: '◈' },
  { id: 'books',      label: 'Books',        icon: '▣' },
  { id: 'users',      label: 'Users',        icon: '◎' },
  { id: 'orders',     label: 'Orders',       icon: '◷' },
  { id: 'categories', label: 'Categories',   icon: '⊞' },
  { id: 'reports',    label: 'Analytics',    icon: '▲' },
];

const STATUS_COLORS = {
  PENDING:   { bg: 'rgba(212,175,55,0.15)',  color: '#D4AF37' },
  CONFIRMED: { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa' },
  SHIPPED:   { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
  DELIVERED: { bg: 'rgba(52,211,153,0.15)',  color: '#34d399' },
  CANCELLED: { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [summary,  setSummary]  = useState(null);
  const [books,    setBooks]    = useState([]);
  const [users,    setUsers]    = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [bookForm, setBookForm] = useState(null);
  const [toast,    setToast]    = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { loadSection(activeSection); }, [activeSection]);

  const loadSection = async (section) => {
    setLoading(true);
    try {
      switch (section) {
        case 'dashboard': {
          const [sum, bk] = await Promise.all([adminApi.getSalesSummary(), booksApi.list({ pageSize: 999 })]);
          setSummary(sum.data);
          setBooks(bk.data.books || []);
          break;
        }
        case 'books': {
          const { data } = await booksApi.list({ pageSize: 999 });
          setBooks(data.books || []);
          break;
        }
        case 'users': {
          const { data } = await adminApi.getAllUsers();
          setUsers(Array.isArray(data) ? data : []);
          break;
        }
        case 'orders': {
          const { data } = await adminApi.getAllOrders();
          setOrders(Array.isArray(data) ? data : []);
          break;
        }
        case 'reports': {
          const [sum, bk] = await Promise.all([adminApi.getSalesSummary(), booksApi.list({ pageSize: 999 })]);
          setSummary(sum.data);
          setBooks(bk.data.books || []);
          break;
        }
        default: break;
      }
    } catch (_) {}
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 3000);
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Permanently delete this book?')) return;
    const { ok, data } = await adminApi.deleteBook(id);
    if (ok) { showToast(data.message || 'Book deleted'); loadSection('books'); }
    else showToast('Failed to delete', 'error');
  };

  const handleSaveBook = async (formData) => {
    setLoading(true);
    const res = bookForm.mode === 'edit'
      ? await adminApi.updateBook(bookForm.data.id, formData)
      : await adminApi.addBook(formData);
    if (res.ok) {
      showToast(res.data.message || 'Saved successfully');
      setBookForm(null);
      loadSection('books');
    } else showToast('Save failed', 'error');
    setLoading(false);
  };

  const handleOrderStatus = async (orderId, status) => {
    await adminApi.updateOrderStatus(orderId, status);
    loadSection('orders');
    showToast(`Order updated to ${status}`);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    const { ok, data } = await adminApi.deleteUser(id);
    if (ok) { showToast(data.message || 'User deleted'); loadSection('users'); }
  };

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const renderDashboard = () => {
    const stats = [
      { label: 'Total Revenue',   value: `$${Number(summary?.totalRevenue || 0).toFixed(2)}`, icon: '💰', color: '#D4AF37', change: '+12%' },
      { label: 'Total Orders',    value: summary?.totalOrders ?? '—',     icon: '📦', color: '#60a5fa', change: '+8%'  },
      { label: 'Total Books',     value: books.length,                    icon: '📚', color: '#a78bfa', change: `${books.length} titles` },
      { label: 'Pending Orders',  value: summary?.pendingOrders ?? '—',   icon: '⏳', color: '#f59e0b', change: 'Needs action' },
      { label: 'Confirmed',       value: summary?.confirmed ?? '—',       icon: '✅', color: '#34d399', change: 'Processing' },
      { label: 'Delivered',       value: summary?.delivered ?? '—',       icon: '🚚', color: '#10b981', change: 'Completed' },
    ];
    return (
      <div className="section-body">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Dashboard Overview</h2>
            <p className="section-subtitle">Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋</p>
          </div>
          <div className="header-date">{new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card" style={{ '--accent': s.color }}>
              <div className="stat-card-top">
                <div className="stat-icon-wrap">{s.icon}</div>
                <span className="stat-change">{s.change}</span>
              </div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
              <div className="stat-bar"><div className="stat-bar-fill" /></div>
            </div>
          ))}
        </div>

        {/* Quick-access recent orders */}
        <div className="dashboard-bottom">
          <div className="quick-card">
            <h3 className="quick-title">📚 Top Categories</h3>
            <div className="cat-chips">
              {[...new Set(books.map(b => b.category))].slice(0, 8).map(c => (
                <span key={c} className="cat-chip">{c}</span>
              ))}
            </div>
          </div>
          <div className="quick-card">
            <h3 className="quick-title">⚡ Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => setActiveSection('books')}>+ Add Book</button>
              <button className="quick-action-btn" onClick={() => setActiveSection('orders')}>View Orders</button>
              <button className="quick-action-btn" onClick={() => setActiveSection('users')}>Manage Users</button>
              <button className="quick-action-btn" onClick={() => setActiveSection('reports')}>View Reports</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── BOOKS ──────────────────────────────────────────────────────────────────
  const renderBooks = () => (
    <div className="section-body">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Manage Books</h2>
          <p className="section-subtitle">{books.length} titles in catalogue</p>
        </div>
        <button className="primary-btn" onClick={() => setBookForm({
          mode: 'add',
          data: { title:'', author:'', price:'', originalPrice:'', category:'', description:'', stock:'', pages:'', year:'', image:'📖', isNew:false, isBestseller:false }
        })}>
          <span>＋</span> Add Book
        </button>
      </div>

      {bookForm && <BookFormModal form={bookForm} onSave={handleSaveBook} onClose={() => setBookForm(null)} />}

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Book</th><th>Author</th><th>Category</th>
              <th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id} className="table-row">
                <td>
                  <div className="book-cell">
                    <span className="book-emoji">{b.image}</span>
                    <span className="book-title-text">{b.title}</span>
                  </div>
                </td>
                <td className="text-muted">{b.author}</td>
                <td><span className="tag tag-category">{b.category}</span></td>
                <td className="text-gold">${Number(b.price).toFixed(2)}</td>
                <td>
                  <span className={`tag ${Number(b.stock) < 5 ? 'tag-danger' : 'tag-success'}`}>
                    {b.stock} {Number(b.stock) < 5 ? '⚠' : ''}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn edit" onClick={() => setBookForm({ mode:'edit', data:b })} title="Edit">✎</button>
                    <button className="icon-btn delete" onClick={() => handleDeleteBook(b.id)} title="Delete">⊗</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {books.length === 0 && <div className="empty-state">No books found</div>}
      </div>
    </div>
  );

  // ── USERS ──────────────────────────────────────────────────────────────────
  const renderUsers = () => (
    <div className="section-body">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Manage Users</h2>
          <p className="section-subtitle">{users.length} registered accounts</p>
        </div>
      </div>
      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="table-row">
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">{u.name?.charAt(0)?.toUpperCase()}</div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <span className={`tag ${u.role === 'ADMIN' ? 'tag-admin' : 'tag-user'}`}>{u.role}</span>
                </td>
                <td className="text-muted mono">{u.joinDate}</td>
                <td>
                  {u.role !== 'ADMIN' && (
                    <button className="icon-btn delete" onClick={() => handleDeleteUser(u.id)} title="Delete">⊗</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="empty-state">No users found</div>}
      </div>
    </div>
  );

  // ── ORDERS ─────────────────────────────────────────────────────────────────
  const renderOrders = () => (
    <div className="section-body">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Manage Orders</h2>
          <p className="section-subtitle">{orders.length} total orders</p>
        </div>
      </div>
      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Total</th>
              <th>Status</th><th>Date</th><th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const sc = STATUS_COLORS[o.status] || {};
              return (
                <tr key={o.id} className="table-row">
                  <td className="mono text-gold" style={{ fontSize:'0.78rem' }}>{o.id}</td>
                  <td className="mono text-muted" style={{ fontSize:'0.78rem' }}>{o.userId}</td>
                  <td className="text-gold">${Number(o.totalPrice || 0).toFixed(2)}</td>
                  <td>
                    <span className="status-pill" style={{ background: sc.bg, color: sc.color }}>
                      {o.status}
                    </span>
                  </td>
                  <td className="text-muted mono" style={{ fontSize:'0.78rem' }}>
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={o.status}
                      onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                    >
                      {['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && <div className="empty-state">No orders yet</div>}
      </div>
    </div>
  );

  // ── REPORTS ────────────────────────────────────────────────────────────────
  const renderReports = () => {
    const avgOrder = summary?.totalOrders
      ? (summary.totalRevenue / summary.totalOrders).toFixed(2) : '0.00';
    const deliveryRate = summary?.totalOrders
      ? ((summary.delivered / summary.totalOrders) * 100).toFixed(0) : 0;
    return (
      <div className="section-body">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Analytics & Reports</h2>
            <p className="section-subtitle">Business performance overview</p>
          </div>
        </div>
        <div className="reports-grid">
          <div className="report-card">
            <div className="report-icon">💰</div>
            <h3>Revenue</h3>
            <p className="report-big">${Number(summary?.totalRevenue || 0).toFixed(2)}</p>
            <div className="report-rows">
              <div className="report-row"><span>Total Orders</span><strong>{summary?.totalOrders ?? 0}</strong></div>
              <div className="report-row"><span>Avg Order Value</span><strong>${avgOrder}</strong></div>
            </div>
          </div>
          <div className="report-card">
            <div className="report-icon">📦</div>
            <h3>Order Status</h3>
            <p className="report-big">{deliveryRate}%</p>
            <p style={{ color:'rgba(240,230,211,0.5)', fontSize:'0.8rem', marginBottom:'1rem' }}>Delivery rate</p>
            <div className="report-rows">
              <div className="report-row"><span>🕐 Pending</span><strong style={{ color:'#D4AF37' }}>{summary?.pendingOrders ?? 0}</strong></div>
              <div className="report-row"><span>✅ Confirmed</span><strong style={{ color:'#60a5fa' }}>{summary?.confirmed ?? 0}</strong></div>
              <div className="report-row"><span>🚚 Delivered</span><strong style={{ color:'#34d399' }}>{summary?.delivered ?? 0}</strong></div>
            </div>
          </div>
          <div className="report-card">
            <div className="report-icon">📚</div>
            <h3>Catalogue</h3>
            <p className="report-big">{books.length}</p>
            <p style={{ color:'rgba(240,230,211,0.5)', fontSize:'0.8rem', marginBottom:'1rem' }}>Total titles</p>
            <div className="report-rows">
              <div className="report-row"><span>Categories</span><strong>{[...new Set(books.map(b => b.category))].length}</strong></div>
              <div className="report-row"><span>Low Stock (&lt;5)</span><strong style={{ color:'#f87171' }}>{books.filter(b => Number(b.stock) < 5).length}</strong></div>
            </div>
          </div>
        </div>

        {/* Status bar chart */}
        {summary && (
          <div className="report-chart-card">
            <h3>Order Pipeline</h3>
            <div className="pipeline">
              {[
                { label:'Pending',   val: summary.pendingOrders, color:'#D4AF37' },
                { label:'Confirmed', val: summary.confirmed,     color:'#60a5fa' },
                { label:'Delivered', val: summary.delivered,     color:'#34d399' },
              ].map(p => {
                const pct = summary.totalOrders ? Math.round((p.val / summary.totalOrders) * 100) : 0;
                return (
                  <div key={p.label} className="pipeline-row">
                    <span className="pipeline-label">{p.label}</span>
                    <div className="pipeline-bar-bg">
                      <div className="pipeline-bar-fill" style={{ width:`${pct}%`, background: p.color }} />
                    </div>
                    <span className="pipeline-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── CATEGORIES ─────────────────────────────────────────────────────────────
  const renderCategories = () => {
    const cats = [...new Set(books.map(b => b.category))];
    const catCounts = cats.map(c => ({ name: c, count: books.filter(b => b.category === c).length }));
    return (
      <div className="section-body">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Category Management</h2>
            <p className="section-subtitle">{cats.length} active categories</p>
          </div>
        </div>
        <p className="hint-text">💡 Categories are derived from the book catalogue. Add a book with a new category to create it automatically.</p>
        <div className="cat-grid">
          {catCounts.map(c => (
            <div key={c.name} className="cat-card">
              <span className="cat-card-name">{c.name}</span>
              <span className="cat-card-count">{c.count} books</span>
              <div className="cat-card-bar">
                <div style={{ width:`${Math.min((c.count / books.length) * 100 * 3, 100)}%`, background:'linear-gradient(90deg,#8B0000,#D4AF37)', borderRadius:'4px', height:'100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sectionMap = {
    dashboard: renderDashboard,
    books:     renderBooks,
    users:     renderUsers,
    orders:    renderOrders,
    reports:   renderReports,
    categories:renderCategories,
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="admin-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src={logoImg} alt="Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <div className="logo-text">
              <p className="logo-title">Luxury Books</p>
              <p className="logo-sub">Admin Panel</p>
            </div>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="sidebar-admin-badge">
          <div className="admin-av">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
          <div className="admin-info">
            <p className="admin-name">{user?.name || 'Admin'}</p>
            <p className="admin-role">Super Admin</p>
          </div>
        </div>

        <nav className="admin-nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="nav-icon">{s.icon}</span>
              <span className="nav-label">{s.label}</span>
              {activeSection === s.id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="footer-btn view-site" onClick={() => navigate('/')}>
            <span>🌐</span><span>View Site</span>
          </button>
          <button className="footer-btn logout" onClick={() => { logout(); navigate('/login'); }}>
            <span>⎋</span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1 className="topbar-section">{SECTIONS.find(s => s.id === activeSection)?.label}</h1>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <span>🔍</span>
              <input placeholder="Search…" className="topbar-search-input" />
            </div>
            <div className="topbar-user">
              <div className="topbar-av">{user?.name?.charAt(0)?.toUpperCase()}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {loading ? (
            <div className="loading-screen">
              <div className="loading-spinner" />
              <p>Loading data…</p>
            </div>
          ) : (
            (sectionMap[activeSection] || (() => <p>Coming soon…</p>))()
          )}
        </div>
      </main>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`admin-toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          <span>{toast.type === 'error' ? '⚠' : '✓'}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

// ── Book Form Modal ────────────────────────────────────────────────────────────
function BookFormModal({ form, onSave, onClose }) {
  const [data, setData] = useState({ ...form.data });

  const fields = [
    { key:'title',         label:'Title',          type:'text',   span:2 },
    { key:'author',        label:'Author',         type:'text',   span:2 },
    { key:'price',         label:'Price ($)',       type:'number', span:1 },
    { key:'originalPrice', label:'Original Price', type:'number', span:1 },
    { key:'category',      label:'Category',       type:'text',   span:1 },
    { key:'stock',         label:'Stock',          type:'number', span:1 },
    { key:'pages',         label:'Pages',          type:'number', span:1 },
    { key:'year',          label:'Year',           type:'number', span:1 },
    { key:'image',         label:'Emoji Icon',     type:'text',   span:1 },
    { key:'description',   label:'Description',    type:'text',   span:3 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{form.mode === 'add' ? '＋ Add New Book' : '✎ Edit Book'}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            {fields.map(f => (
              <div key={f.key} className="modal-field" style={{ gridColumn: `span ${f.span}` }}>
                <label className="modal-label">{f.label}</label>
                <input
                  className="modal-input"
                  type={f.type}
                  value={data[f.key] || ''}
                  onChange={e => setData(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.label}
                />
              </div>
            ))}
            <div className="modal-field modal-checks">
              <label className="modal-check-label">
                <input type="checkbox" checked={!!data.isNew}
                  onChange={e => setData(p => ({ ...p, isNew: e.target.checked }))} />
                New Release
              </label>
              <label className="modal-check-label">
                <input type="checkbox" checked={!!data.isBestseller}
                  onChange={e => setData(p => ({ ...p, isBestseller: e.target.checked }))} />
                Bestseller
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="modal-save-btn" onClick={() => onSave(data)}>
            {form.mode === 'add' ? '＋ Add Book' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
