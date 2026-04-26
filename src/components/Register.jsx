// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const { register, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch(strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  };

  const getPasswordStrengthColor = (strength) => {
    switch(strength) {
      case 0: return '#ef4444';
      case 1: return '#f97316';
      case 2: return '#eab308';
      case 3: return '#84cc16';
      case 4: return '#10b981';
      default: return '#ef4444';
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.name && formData.email && formData.password && passwordsMatch && agreeTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Please agree to the Terms and Conditions');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');
    const result = await signInWithGoogle();
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsLoading(true);
    setError('');
    const result = await signInWithApple();
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
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
            <h3>Account Created!</h3>
            <p>Redirecting to home...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}

      <div className="premium-card">
        <div className="card-shine"></div>
        
        <div className="card-header">
          <div className="icon-wrapper">
            <div className="icon-ring">📚</div>
          </div>
          <h1>Create Account</h1>
          <p>Join luxury reading experience</p>
        </div>

        {error && (
          <div className="error-toast">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="premium-form">
          <div className={`form-group ${focusedField === 'name' ? 'focused' : ''}`}>
            <div className="input-wrapper">
              <div className="input-icon">👤</div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                required
              />
              <label>Full Name</label>
              <div className="input-border"></div>
            </div>
          </div>

          <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
            <div className="input-wrapper">
              <div className="input-icon">✉️</div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                required
              />
              <label>Email Address</label>
              <div className="input-border"></div>
            </div>
          </div>

          <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
            <div className="input-wrapper">
              <div className="input-icon">🔒</div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                required
              />
              <label>Password</label>
              <button
                type="button"
                className="password-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              <div className="input-border"></div>
            </div>
            {formData.password && (
              <div className="strength-indicator">
                <div className="strength-bars">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`strength-bar ${i < passwordStrength ? 'active' : ''}`}
                      style={{ backgroundColor: i < passwordStrength ? getPasswordStrengthColor(passwordStrength) : 'rgba(255,255,255,0.1)' }}
                    ></div>
                  ))}
                </div>
                <div className="strength-text" style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                  {getPasswordStrengthText(passwordStrength)}
                </div>
              </div>
            )}
          </div>

          <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
            <div className="input-wrapper">
              <div className="input-icon">🔐</div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                required
              />
              <label>Confirm Password</label>
              <button
                type="button"
                className="password-visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              <div className="input-border"></div>
            </div>
            {formData.confirmPassword && (
              <div className={passwordsMatch ? 'match-success' : 'match-error'}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>

          <div className="terms-wrapper">
            <label className="custom-checkbox">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="checkbox-text">
                I agree to <a href="#">Terms</a> & <a href="#">Privacy</a>
              </span>
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={!isFormValid || isLoading}>
            {isLoading ? (
              <div className="btn-loader">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="divider">
            <span>Or sign up with</span>
          </div>

          <div className="social-section">
            <button 
              type="button" 
              className="social-btn google"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
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
              onClick={handleAppleSignUp}
              disabled={isLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 12.75c0-1.74 1.43-3.15 3.21-3.35-.39-.62-.94-1.15-1.6-1.5-1.07-.58-2.32-.74-3.57-.64-1.26.1-2.47.53-3.48 1.24-1.01-.71-2.22-1.14-3.48-1.24-1.25-.1-2.5.06-3.57.64-.66.35-1.21.88-1.6 1.5-1.78.2-3.21 1.61-3.21 3.35 0 1.35.48 2.67 1.33 3.69.85 1.02 1.98 1.77 3.23 2.11.58.15 1.18.23 1.79.23.71 0 1.42-.13 2.1-.38.39-.15.81-.15 1.2 0 .68.25 1.39.38 2.1.38.61 0 1.21-.08 1.79-.23 1.25-.34 2.38-1.09 3.23-2.11.85-1.02 1.33-2.34 1.33-3.69z"/>
              </svg>
              Apple
            </button>
          </div>
        </form>

        <div className="login-link">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;