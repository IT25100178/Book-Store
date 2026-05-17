// src/components/auth/ForgotPassword.jsx
// Member 1 – Athethan  (standalone page at /forgot-password)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';   // reuse login styles

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email,      setEmail]      = useState('');
  const [newPwd,     setNewPwd]     = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading,    setLoading]    = useState(false);
  const [message,    setMessage]    = useState('');
  const [error,      setError]      = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');

    if (newPwd !== confirmPwd) { setError('Passwords do not match'); return; }
    if (newPwd.length < 6)    { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    const result = await resetPassword(email, newPwd);
    setLoading(false);

    if (result.success) {
      setMessage('Password reset successfully! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2500);
    } else {
      setError(result.error || result.message || 'Reset failed');
    }
  };

  return (
    <div className="login-container">
      <div className="background-image-layer"></div>
      <div className="gradient-overlay"></div>

      <div className="animated-books">
        {['📚','📖','📕','📗','📘','📙'].map((b, i) => (
          <div key={i} className="book-flying">{b}</div>
        ))}
      </div>

      <div className="login-card" style={{ maxWidth: 420 }}>
        <div className="card-shine"></div>

        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo-circle" style={{ background: 'linear-gradient(135deg,#8B0000,#D4AF37)' }}>
              🔑
            </div>
          </div>
          <h2>Reset Password</h2>
          <p>Enter your email and choose a new password</p>
        </div>

        {error   && <div className="error-message"><div className="error-icon">⚠️</div><p>{error}</p></div>}
        {message && <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)',
          borderRadius:8, padding:'0.75rem 1rem', color:'#4ade80', marginBottom:'1rem', fontSize:'0.9rem' }}>
          {message}
        </div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="fp-email">Email Address</label>
            <input id="fp-email" type="email" placeholder="your@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required className="input-field" />
          </div>
          <div className="input-group">
            <label htmlFor="fp-new-pwd">New Password</label>
            <input id="fp-new-pwd" type="password" placeholder="At least 6 characters"
              value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
              required className="input-field" />
          </div>
          <div className="input-group">
            <label htmlFor="fp-confirm-pwd">Confirm New Password</label>
            <input id="fp-confirm-pwd" type="password" placeholder="Repeat new password"
              value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
              required className="input-field" />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Reset Password'}
          </button>
        </form>

        <p className="signup-prompt" style={{ marginTop:'1.5rem' }}>
          <Link to="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
