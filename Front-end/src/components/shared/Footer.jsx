import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="footer-glow"></div>
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <h3 className="footer-brand-title">LUXURY<span>BOOKS</span></h3>
            <p className="footer-desc">
              Your premier destination for curated book collections. We bring the magic of literature to life with an elegant and modern reading experience.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon">𝕏</a>
              <a href="#" className="social-icon">IG</a>
              <a href="#" className="social-icon">FB</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/books" className="footer-link">Shop Books</Link>
            <Link to="/cart" className="footer-link">Your Cart</Link>
            <Link to="/profile" className="footer-link">My Account</Link>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <Link to="/books?category=Fiction" className="footer-link">Fiction</Link>
            <Link to="/books?category=Classic" className="footer-link">Classic</Link>
            <Link to="/books?category=Fantasy" className="footer-link">Fantasy</Link>
            <Link to="/books?category=Science" className="footer-link">Science</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact Us</h4>
            <p className="footer-contact-item">📍 132/1 Thalaiyadi Lane, Jaffna</p>
            <p className="footer-contact-item">📞 (+94) 742-624-977</p>
            <p className="footer-contact-item">✉️ hello@luxurybooks.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Luxury Books. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
