// src/components/profile/UserProfilePage.jsx
// Member 6 – Vishok
// Adapted: removed localStorage cart (now using CartContext), fixed import paths
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import UploadProfilePicture from './UploadProfilePicture';
import OrderHistory from './OrderHistory';
import Wishlist from './Wishlist';
import SavedAddress from './SavedAddress';
import MyReviews from './MyReviews';
import logoImg from '../../assets/Luxury books logo.png';
import './profile.css';

const TABS = [
  { id: 'profile',  label: '👤 Edit Profile'    },
  { id: 'password', label: '🔒 Change Password'  },
  { id: 'picture',  label: '🖼️ Profile Picture'  },
  { id: 'orders',   label: '📦 Order History'    },
  { id: 'wishlist', label: '❤️  Wishlist'         },
  { id: 'address',  label: '📍 Saved Address'    },
  { id: 'reviews',  label: '⭐ My Reviews'        },
  { id: 'logout',   label: '🚪 Logout'           },
];

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const { cartCount }    = useCart();
  const navigate         = useNavigate();

  const [activeTab,       setActiveTab]       = useState('profile');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Apply theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const handleTabClick = (tabId) => {
    if (tabId === 'logout') { setShowLogoutModal(true); return; }
    setActiveTab(tabId);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
  };

  const displayInitial   = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';
  const hasCustomAvatar  = user?.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http'));

  const CONTENT_MAP = {
    profile:  <EditProfile />,
    password: <ChangePassword />,
    picture:  <UploadProfilePicture />,
    orders:   <OrderHistory />,
    wishlist: <Wishlist />,
    address:  <SavedAddress />,
    reviews:  <MyReviews />,
  };

  return (
    <div className="profile-page-wrapper" style={{ padding: 0 }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="navbar animate-slide-down">
        <div className="navbar-brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={() => navigate('/')}>
          <img src={logoImg} alt="Luxury Books Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          <span className="brand-text">LUXURY<span>BOOKS</span></span>
        </div>

        <div className="navbar-actions">
          {/* Cart icon links to /cart page */}
          <Link to="/cart" className="cart-icon-wrapper" style={{ textDecoration:'none', color:'inherit' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1.5"></circle>
              <circle cx="20" cy="21" r="1.5"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge animate-pulse">{cartCount}</span>}
          </Link>

          <div className="user-dropdown">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="user-name">
              {user?.name || user?.email?.split('@')[0] || 'Reader'}
            </span>
            <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l4-4-4-4M20 13H9"
                  stroke="currentColor" strokeWidth="2"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: '110px 20px 40px' }}>
        <div className="profile-container">

          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="sidebar-avatar-area">
              <div className="sidebar-avatar">
                {hasCustomAvatar ? (
                  <img src={user.avatar} alt={user.name || 'User'} />
                ) : displayInitial}
              </div>
              <div className="sidebar-name">{user?.name || 'Reader'}</div>
              <div className="sidebar-email">{user?.email || ''}</div>
              {user?.role === 'ADMIN' && (
                <div style={{ marginTop:'0.5rem' }}>
                  <Link to="/admin" style={{
                    background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)',
                    borderRadius:'8px', color:'#D4AF37', padding:'0.4rem 1rem',
                    fontSize:'0.8rem', fontWeight:700, textDecoration:'none'
                  }}>
                    Admin Panel →
                  </Link>
                </div>
              )}
            </div>

            <nav className="sidebar-nav">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`sidebar-nav-btn${tab.id === 'logout' ? ' logout-tab-btn' : ''}${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content panel */}
          <main className="profile-content-panel">
            {CONTENT_MAP[activeTab] || null}
          </main>
        </div>
      </div>

      {/* ── Logout Modal ───────────────────────────────────────────────────── */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setShowLogoutModal(false)}>
          <div style={{
            background: 'var(--profile-card-bg, #14141f)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '20px', padding: '36px',
            maxWidth: '380px', width: '90%', textAlign: 'center',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color:'var(--profile-section-title-color, #D4AF37)', fontSize:'1.3rem', marginBottom:'12px' }}>
              Are you sure?
            </h3>
            <p style={{ color:'rgba(240,230,211,0.7)', fontSize:'0.9rem', marginBottom:'28px' }}>
              You will be logged out of your account.
            </p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
              <button className="profile-btn-danger" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="profile-btn-primary" onClick={handleConfirmLogout}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
