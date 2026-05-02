// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneLoginModal from './PhoneLoginModal';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  
  const { login, signInWithGoogle, signInWithApple, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(email, password, rememberMe);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(result.error || 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    // Show verification message
    setVerificationMessage('Connecting to Google...');
    setShowVerification(true);
    
    try {
      const result = await signInWithGoogle();
      setShowVerification(false);
      
      if (result.success) {
        // Show success and redirect
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(result.error || 'Google sign in failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setShowVerification(false);
      setError('Google sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    // Show verification message
    setVerificationMessage('Connecting to Apple...');
    setShowVerification(true);
    
    try {
      const result = await signInWithApple();
      setShowVerification(false);
      
      if (result.success) {
        // Show success and redirect
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(result.error || 'Apple sign in failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setShowVerification(false);
      setError('Apple sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handlePhoneLoginSuccess = (user) => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    setIsResetting(true);

    const result = await resetPassword(resetEmail);
    if (result.success) {
      setResetMessage(result.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetMessage('');
      }, 3000);
    } else {
      setResetError(result.error);
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
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <div className="verification-overlay">
          <div className="verification-card">
            <div className="verification-spinner"></div>
            <h3>{verificationMessage}</h3>
            <p>Please wait while we verify your account...</p>
            <div className="verification-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay */}
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
            <p>Successfully logged in. Redirecting...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="modal-close" onClick={() => setShowForgotPassword(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Enter your email to receive a password reset link</p>
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="modal-input"
                />
                {resetError && <div className="modal-error">{resetError}</div>}
                {resetMessage && <div className="modal-success">{resetMessage}</div>}
                <button type="submit" className="modal-submit" disabled={isResetting}>
                  {isResetting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
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
          <p>Sign in to continue</p>
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
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
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

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-buttons">
            <button 
              type="button" 
              className="social-btn google"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button 
              type="button" 
              className="social-btn apple"
              onClick={handleAppleSignIn}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 12.75c0-1.74 1.43-3.15 3.21-3.35-.39-.62-.94-1.15-1.6-1.5-1.07-.58-2.32-.74-3.57-.64-1.26.1-2.47.53-3.48 1.24-1.01-.71-2.22-1.14-3.48-1.24-1.25-.1-2.5.06-3.57.64-.66.35-1.21.88-1.6 1.5-1.78.2-3.21 1.61-3.21 3.35 0 1.35.48 2.67 1.33 3.69.85 1.02 1.98 1.77 3.23 2.11.58.15 1.18.23 1.79.23.71 0 1.42-.13 2.1-.38.39-.15.81-.15 1.2 0 .68.25 1.39.38 2.1.38.61 0 1.21-.08 1.79-.23 1.25-.34 2.38-1.09 3.23-2.11.85-1.02 1.33-2.34 1.33-3.69z"/>
              </svg>
              Apple
            </button>
            <button 
              type="button" 
              className="social-btn phone"
              onClick={() => setShowPhoneModal(true)}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Phone
            </button>
          </div>
        </form>

        <p className="signup-prompt">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>

      <PhoneLoginModal 
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={handlePhoneLoginSuccess}
      />
    </div>
  );
}

export default Login;