import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import UploadProfilePicture from './UploadProfilePicture';
import OrderHistory from './OrderHistory';
import Wishlist from './Wishlist';
import SavedAddress from './SavedAddress';
import MyReviews from './MyReviews';
import './profile.css';

const TABS = [
  { id: 'profile',  label: '👤 Edit Profile' },
  { id: 'password', label: '🔒 Change Password' },
  { id: 'picture',  label: '🖼️ Profile Picture' },
  { id: 'orders',   label: '📦 Order History' },
  { id: 'wishlist', label: '❤️ Wishlist' },
  { id: 'address',  label: '📍 Saved Address' },
  { id: 'reviews',  label: '⭐ My Reviews' },
  { id: 'logout',   label: '🚪 Logout' },
];

const CONTENT_MAP = {
  profile:  <EditProfile />,
  password: <ChangePassword />,
  picture:  <UploadProfilePicture />,
  orders:   <OrderHistory />,
  wishlist: <Wishlist />,
  address:  <SavedAddress />,
  reviews:  <MyReviews />,
};

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const loadCart = () => {
    const all = JSON.parse(localStorage.getItem('cart') || '[]');
    return all.filter((i) => String(i.userID) === String(user?.id));
  };

  useEffect(() => {
    const items = loadCart();
    setCartItems(items);
    setCartCount(items.reduce((sum, i) => sum + (i.quantity || 1), 0));
  }, [user]);

  useEffect(() => {
    const handleStorage = () => {
      const items = loadCart();
      setCartItems(items);
      setCartCount(items.reduce((sum, i) => sum + (i.quantity || 1), 0));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const saveCart = (updated) => {
    const all = JSON.parse(localStorage.getItem('cart') || '[]');
    const others = all.filter((i) => String(i.userID) !== String(user?.id));
    localStorage.setItem('cart', JSON.stringify([...others, ...updated]));
    setCartItems(updated);
    setCartCount(updated.reduce((sum, i) => sum + (i.quantity || 1), 0));
  };

  const removeFromCart = (id) => {
    saveCart(cartItems.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    saveCart(cartItems.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const getCartTotal = () =>
    cartItems.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);

  const getCartSavings = () =>
    cartItems.reduce((sum, i) => {
      if (i.originalPrice) return sum + ((i.originalPrice - i.price) * (i.quantity || 1));
      return sum;
    }, 0);

  const handleTabClick = (tabId) => {
    if (tabId === 'logout') { setShowLogoutModal(true); return; }
    setActiveTab(tabId);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
  };

  const displayInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';
  const hasCustomAvatar = user?.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http'));

  return (
    <div className="profile-page-wrapper" style={{ padding: 0 }}>

      {/* ── Navbar ── */}
      <nav className="navbar animate-slide-down">
        <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="brand-text">LUXURY<span>BOOKS</span></span>
        </div>

        <div className="navbar-actions">
          <div className="cart-icon-wrapper" onClick={() => setShowCart(!showCart)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1.5"></circle>
              <circle cx="20" cy="21" r="1.5"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span className="cart-badge animate-pulse">{cartCount}</span>
            )}
          </div>

          <div className="user-dropdown">
            <div className="user-avatar">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <span className="user-name">
              {user?.name || user?.email?.split('@')[0] || 'Reader'}
            </span>
            <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l4-4-4-4M20 13H9" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Cart Sidebar ── */}
      {showCart && (
        <>
          <div className="cart-overlay" onClick={() => setShowCart(false)}></div>
          <div className="cart-sidebar animate-slide-left">
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <button className="cart-close" onClick={() => setShowCart(false)}>×</button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="21" r="1.5" stroke="currentColor"/>
                  <circle cx="20" cy="21" r="1.5" stroke="currentColor"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor"/>
                </svg>
                <p>Your cart is empty</p>
                <button className="continue-shopping" onClick={() => setShowCart(false)}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item animate-fade-in">
                      <div className="cart-item-image">
                        {item.image && (item.image.startsWith('http') || item.image.startsWith('data:')) ? (
                          <img src={item.image} alt={item.title} style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          item.image || '📖'
                        )}
                      </div>
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p className="cart-item-author">{item.author}</p>
                        <div className="cart-item-price">
                          <span className="current-price">LKR {Number(item.price).toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="original-price">LKR {Number(item.originalPrice).toLocaleString()}</span>
                          )}
                        </div>
                        <div className="cart-item-quantity">
                          <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>-</button>
                          <span>{item.quantity || 1}</span>
                          <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                        </div>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  {getCartSavings() > 0 && (
                    <div className="cart-savings">
                      <span>You saved</span>
                      <span className="savings-amount">LKR {getCartSavings().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="cart-total">
                    <span>Total</span>
                    <span className="total-amount">LKR {getCartTotal().toLocaleString()}</span>
                  </div>
                  <button className="checkout-btn">
                    Proceed to Checkout
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ── Page body ── */}
      <div style={{ padding: '110px 20px 40px' }}>
        <div className="profile-container">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="sidebar-avatar-area">
              <div className="sidebar-avatar">
                {hasCustomAvatar ? (
                  <img src={user.avatar} alt={user.name || 'User'} />
                ) : (
                  displayInitial
                )}
              </div>
              <div className="sidebar-name">{user?.name || 'Reader'}</div>
              <div className="sidebar-email">{user?.email || ''}</div>
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

      {/* ── Logout confirmation modal ── */}
      {showLogoutModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={{
              background: 'var(--profile-card-bg)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '20px', padding: '36px',
              maxWidth: '380px', width: '90%', textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--profile-section-title-color)', fontSize: '1.3rem', marginBottom: '12px' }}>
              Are you sure?
            </h3>
            <p style={{ color: 'var(--profile-label-color)', fontSize: '0.9rem', marginBottom: '28px' }}>
              You will be logged out of your account.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="profile-btn-danger" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="profile-btn-primary" onClick={handleConfirmLogout}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
