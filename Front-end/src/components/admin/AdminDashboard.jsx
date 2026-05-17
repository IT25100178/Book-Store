// src/components/admin/AdminDashboard.jsx
// Member 7 – Vishahan
import { useState, useEffect } from 'react';
import { useNavigate }          from 'react-router-dom';
import { admin as adminApi, books as booksApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const SECTIONS = [
  { id: 'dashboard',  label: '📊 Dashboard',         icon: '📊' },
  { id: 'books',      label: '📚 Manage Books',       icon: '📚' },
  { id: 'users',      label: '👥 Manage Users',       icon: '👥' },
  { id: 'orders',     label: '🛒 Manage Orders',      icon: '🛒' },
  { id: 'categories', label: '🏷️ Categories',         icon: '🏷️' },
  { id: 'reports',    label: '📈 Reports / Analytics', icon: '📈' },
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [summary,  setSummary]  = useState(null);
  const [books,    setBooks]    = useState([]);
  const [users,    setUsers]    = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [bookForm, setBookForm] = useState(null);  // null | {mode:'add'|'edit', data}
  const [message,  setMessage]  = useState('');

  // ── Load data by section ──────────────────────────────────────────────────

  useEffect(() => { loadSection(activeSection); }, [activeSection]);

  const loadSection = async (section) => {
    setLoading(true);
    try {
      switch (section) {
        case 'dashboard': {
          const { data } = await adminApi.getSalesSummary();
          setSummary(data);
          break;
        }
        case 'books': {
          const { data } = await booksApi.list({ pageSize: 100 });
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
          const { data } = await adminApi.getSalesSummary();
          setSummary(data);
          break;
        }
        default: break;
      }
    } catch (_) {}
    setLoading(false);
  };

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  // ── Book CRUD ─────────────────────────────────────────────────────────────

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    const { ok, data } = await adminApi.deleteBook(id);
    if (ok) { showMsg(data.message); loadSection('books'); }
  };

  const handleSaveBook = async (formData) => {
    setLoading(true);
    let res;
    if (bookForm.mode === 'edit') {
      res = await adminApi.updateBook(bookForm.data.id, formData);
    } else {
      res = await adminApi.addBook(formData);
    }
    if (res.ok) {
      showMsg(res.data.message);
      setBookForm(null);
      loadSection('books');
    }
    setLoading(false);
  };

  // ── Order Status ──────────────────────────────────────────────────────────

  const handleOrderStatus = async (orderId, status) => {
    await adminApi.updateOrderStatus(orderId, status);
    loadSection('orders');
  };

  // ── User Delete ───────────────────────────────────────────────────────────

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const { ok, data } = await adminApi.deleteUser(id);
    if (ok) { showMsg(data.message); loadSection('users'); }
  };

  // ── Render Sections ───────────────────────────────────────────────────────

  const renderDashboard = () => (
    <div>
      <h2 className="section-title">Dashboard Overview</h2>
      {summary && (
        <div className="stats-grid">
          {[
            { label: 'Total Orders',   value: summary.totalOrders,   icon: '🛒' },
            { label: 'Total Revenue',  value: `$${summary.totalRevenue}`, icon: '💰' },
            { label: 'Pending Orders', value: summary.pendingOrders, icon: '⏳' },
            { label: 'Confirmed',      value: summary.confirmed,     icon: '✅' },
            { label: 'Delivered',      value: summary.delivered,     icon: '📦' },
            { label: 'Total Books',    value: books.length,          icon: '📚' },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div>
                <p className="stat-value">{stat.value ?? '—'}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBooks = () => (
    <div>
      <div className="section-header-row">
        <h2 className="section-title">Manage Books</h2>
        <button className="add-btn" onClick={() =>
          setBookForm({ mode: 'add', data: { title:'', author:'', price:'', originalPrice:'',
            category:'', description:'', stock:'', pages:'', year:'', image:'📖',
            isNew: false, isBestseller: false } })
        }>
          + Add Book
        </button>
      </div>

      {bookForm && <BookFormModal form={bookForm} onSave={handleSaveBook} onClose={() => setBookForm(null)} />}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th><th>Author</th><th>Category</th>
              <th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td><span className="book-emoji-cell">{b.image}</span> {b.title}</td>
                <td>{b.author}</td>
                <td><span className="category-badge">{b.category}</span></td>
                <td>${b.price}</td>
                <td>
                  <span className={`stock-badge ${b.stock < 5 ? 'low' : 'ok'}`}>
                    {b.stock}
                  </span>
                </td>
                <td>
                  <button className="edit-btn"
                    onClick={() => setBookForm({ mode: 'edit', data: b })}>Edit</button>
                  <button className="del-btn"
                    onClick={() => handleDeleteBook(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2 className="section-title">Manage Users</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                <td>{u.joinDate}</td>
                <td>
                  {u.role !== 'ADMIN' && (
                    <button className="del-btn" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <h2 className="section-title">Manage Orders</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th><th>User ID</th><th>Total</th>
              <th>Status</th><th>Date</th><th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="mono">{o.id}</td>
                <td className="mono">{o.userId}</td>
                <td>${o.totalPrice}</td>
                <td><span className={`status-badge ${o.status?.toLowerCase()}`}>{o.status}</span></td>
                <td>{o.createdAt}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <h2 className="section-title">Reports & Analytics</h2>
      {summary && (
        <div className="reports-grid">
          <div className="report-card">
            <h3>Sales Summary</h3>
            <div className="report-metric"><span>Total Revenue</span><strong>${summary.totalRevenue}</strong></div>
            <div className="report-metric"><span>Total Orders</span><strong>{summary.totalOrders}</strong></div>
            <div className="report-metric"><span>Avg Order Value</span>
              <strong>${summary.totalOrders ? (summary.totalRevenue / summary.totalOrders).toFixed(2) : '0.00'}</strong>
            </div>
          </div>
          <div className="report-card">
            <h3>Order Status Breakdown</h3>
            <div className="report-metric"><span>Pending</span><strong>{summary.pendingOrders}</strong></div>
            <div className="report-metric"><span>Confirmed</span><strong>{summary.confirmed}</strong></div>
            <div className="report-metric"><span>Delivered</span><strong>{summary.delivered}</strong></div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div>
      <h2 className="section-title">Category Management</h2>
      <p className="category-hint">
        Categories are automatically derived from the books in the catalogue.
        To add a new category, simply add a book with that category when managing books.
      </p>
      <div className="category-tags">
        {[...new Set(books.map(b => b.category))].map(cat => (
          <span key={cat} className="cat-tag">{cat}</span>
        ))}
      </div>
    </div>
  );

  const sectionMap = {
    dashboard:  renderDashboard,
    books:      renderBooks,
    users:      renderUsers,
    orders:     renderOrders,
    reports:    renderReports,
    categories: renderCategories,
  };

  return (
    <div className="admin-layout">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>📚</span>
          <div>
            <p className="admin-logo-title">Luxury Books</p>
            <p className="admin-logo-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`admin-nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => { setActiveSection(s.id); if (s.id === 'books') loadSection('books'); }}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout" onClick={() => { logout(); navigate('/login'); }}>
            🚪 Logout
          </button>
          <button className="admin-view-site" onClick={() => navigate('/')}>
            🌐 View Site
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="admin-main">
        {message && <div className="admin-message">{message}</div>}
        {loading ? (
          <div className="admin-loading">Loading…</div>
        ) : (
          (sectionMap[activeSection] || (() => <p>Section coming soon</p>))()
        )}
      </main>
    </div>
  );
}

// ── Book Form Modal ───────────────────────────────────────────────────────────

function BookFormModal({ form, onSave, onClose }) {
  const [data, setData] = useState({ ...form.data });

  const fields = [
    { key: 'title',         label: 'Title',          type: 'text'   },
    { key: 'author',        label: 'Author',         type: 'text'   },
    { key: 'price',         label: 'Price',          type: 'number' },
    { key: 'originalPrice', label: 'Original Price', type: 'number' },
    { key: 'category',      label: 'Category',       type: 'text'   },
    { key: 'description',   label: 'Description',    type: 'text'   },
    { key: 'stock',         label: 'Stock',          type: 'number' },
    { key: 'pages',         label: 'Pages',          type: 'number' },
    { key: 'year',          label: 'Year',           type: 'number' },
    { key: 'image',         label: 'Image (emoji)',  type: 'text'   },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{form.mode === 'add' ? 'Add New Book' : 'Edit Book'}</h3>
        <div className="modal-form">
          {fields.map(f => (
            <div key={f.key} className="modal-field">
              <label>{f.label}</label>
              <input
                type={f.type}
                value={data[f.key] || ''}
                onChange={(e) => setData(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="modal-field">
            <label>New Release</label>
            <input type="checkbox" checked={!!data.isNew}
              onChange={(e) => setData(prev => ({ ...prev, isNew: e.target.checked }))} />
          </div>
          <div className="modal-field">
            <label>Bestseller</label>
            <input type="checkbox" checked={!!data.isBestseller}
              onChange={(e) => setData(prev => ({ ...prev, isBestseller: e.target.checked }))} />
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-save" onClick={() => onSave(data)}>Save</button>
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
