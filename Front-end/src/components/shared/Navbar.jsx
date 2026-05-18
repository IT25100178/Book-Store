import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logoImg from '../../assets/Luxury books logo.png';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`premium-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <img src={logoImg} alt="Luxury Books" className="brand-logo" />
          <span className="brand-text">LUXURY<span>BOOKS</span></span>
        </div>

        {/* Desktop Links */}
        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/books" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Shop Books</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          )}
        </div>

        {/* Actions Section */}
        <div className="navbar-actions">
          {/* Cart */}
          <Link to="/cart" className="cart-action">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1.5"></circle>
              <circle cx="20" cy="21" r="1.5"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Auth */}
          {user ? (
            <div className="user-menu-wrapper">
              <Link to="/profile" className="user-avatar-link">
                <div className="user-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              </Link>
              <div className="user-dropdown-menu">
                <Link to="/profile">Profile</Link>
                <Link to="/cart">Cart</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-glass">Sign In</Link>
          )}

          {/* Mobile Toggle */}
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
