// src/components/auth/Login.jsx
// Member 1 – Athethan
// Adapted from original: removed Firebase/Google/Apple/Phone deps, uses Java backend via AuthContext
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const [email,          setEmail]          = useState('');
  const [password,       setPassword]       = useState('');
  const [error,          setError]          = useState('');
  const [isLoading,      setIsLoading]      = useState(false);
  const [showSuccess,    setShowSuccess]    = useState(false);
  const [rememberMe,     setRememberMe]     = useState(false);
  const [showForgotPwd,  setShowForgotPwd]  = useState(false);
  const [resetEmail,     setResetEmail]     = useState('');
  const [resetNewPwd,    setResetNewPwd]    = useState('');
  const [resetMsg,       setResetMsg]       = useState('');
  const [resetErr,       setResetErr]       = useState('');
  const [isResetting,    setIsResetting]    = useState(false);

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  // ── Submit login ──────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password, rememberMe);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } else {
      setError(result.error || 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  // ── Forgot Password – calls Java /api/auth/forgot-password ───────────────

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetErr('');
    setResetMsg('');
    setIsResetting(true);

    const result = await resetPassword(resetEmail, resetNewPwd);
    if (result.success) {
      setResetMsg(result.message);
      setTimeout(() => {
        setShowForgotPwd(false);
        setResetEmail('');
        setResetNewPwd('');
        setResetMsg('');
      }, 3000);
    } else {
      setResetErr(result.error || result.message);
    }
    setIsResetting(false);
  };

  return (
    <div className="login-container">
      <div className="background-image-layer"></div>
      <div className="gradient-overlay"></div>

      <div className="animated-books">
        <div className="book-flying">📚</div>
        <div className="book-flying">📖</div>
        <div className="book-flying">📕</div>
        <div className="book-flying">📗</div>
        <div className="book-flying">📘</div>
        <div className="book-flying">📙</div>
      </div>

      <div className="particle-network">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${(i * 3.33) % 100}%`,
            top:  `${(i * 3.17) % 100}%`,
            animationDelay:    `${(i * 0.17) % 5}s`,
            animationDuration: `${3 + (i % 4)}s`
          }}></div>
        ))}
      </div>

      {/* ── Success Overlay ───────────────────────────────────────────────── */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon">
              <div className="checkmark-circle">
                <svg viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="white" strokeWidth="3"/>
                  <path className="checkmark-check" fill="none" stroke="white" strokeWidth="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
            <h3>Welcome Back!</h3>
            <p>Successfully logged in. Redirecting…</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}

      {/* ── Forgot Password Modal ─────────────────────────────────────────── */}
      {showForgotPwd && (
        <div className="modal-overlay" onClick={() => setShowForgotPwd(false)}>
          <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="modal-close" onClick={() => setShowForgotPwd(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Enter your email and a new password</p>
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="modal-input"
                />
                <input
                  type="password"
                  placeholder="New password (min 6 chars)"
                  value={resetNewPwd}
                  onChange={(e) => setResetNewPwd(e.target.value)}
                  required
                  className="modal-input"
                  style={{ marginTop: '0.75rem' }}
                />
                {resetErr && <div className="modal-error">{resetErr}</div>}
                {resetMsg && <div className="modal-success">{resetMsg}</div>}
                <button type="submit" className="modal-submit" disabled={isResetting}>
                  {isResetting ? 'Resetting…' : 'Reset Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Login Card ────────────────────────────────────────────────────── */}
      <div className="login-card">
        <div className="card-shine"></div>

        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to Luxury Books</p>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="hello@luxury.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <div className="input-focus-effect"></div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <div className="input-focus-effect"></div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot-link"
              onClick={() => setShowForgotPwd(true)}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-btn" id="login-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                Sign In
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="signup-prompt">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
