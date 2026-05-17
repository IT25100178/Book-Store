// src/components/auth/Register.jsx
// Member 1 – Athethan
// Adapted: removed Firebase/Google/Apple, fixed import paths for new folder structure
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: ''
  });
  const [focusedField,        setFocusedField]        = useState(null);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error,               setError]               = useState('');
  const [isLoading,           setIsLoading]           = useState(false);
  const [showSuccess,         setShowSuccess]         = useState(false);
  const [agreeTerms,          setAgreeTerms]          = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8)                              strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/))                           strength++;
    if (password.match(/[^a-zA-Z0-9]/))                   strength++;
    return strength;
  };

  const strengthLabel = ['Very Weak','Weak','Fair','Good','Strong'];
  const strengthColor = ['#ef4444','#f97316','#eab308','#84cc16','#10b981'];

  const passwordStrength   = calculatePasswordStrength(formData.password);
  const passwordsMatch     = formData.password === formData.confirmPassword;
  const isFormValid        = formData.name && formData.email && formData.password && passwordsMatch && agreeTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms)                         { setError('Please agree to the Terms and Conditions'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6)        { setError('Password must be at least 6 characters'); return; }

    setError('');
    setIsLoading(true);

    const result = await register(formData.name, formData.email, formData.password, formData.phone);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="background-image-layer"></div>
      <div className="gradient-overlay"></div>

      <div className="animated-books">
        {['📚','📖','📕','📗','📘','📙'].map((b,i) => (
          <div key={i} className="book-flying">{b}</div>
        ))}
      </div>

      <div className="particle-network">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${(i * 3.33) % 100}%`,
            top:  `${(i * 3.17) % 100}%`,
            animationDelay: `${(i * 0.17) % 5}s`,
            animationDuration: `${3 + (i % 4)}s`
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
            <p>Redirecting to home…</p>
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
          <p>Join the luxury reading experience</p>
        </div>

        {error && (
          <div className="error-toast">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="premium-form">
          {[
            { key: 'name',  label: 'Full Name',      icon: '👤', type: 'text'  },
            { key: 'email', label: 'Email Address',   icon: '✉️', type: 'email' },
            { key: 'phone', label: 'Phone (optional)', icon: '📱', type: 'tel'  },
          ].map(({ key, label, icon, type }) => (
            <div key={key} className={`form-group ${focusedField === key ? 'focused' : ''}`}>
              <div className="input-wrapper">
                <div className="input-icon">{icon}</div>
                <input
                  type={type}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(key)}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  required={key !== 'phone'}
                />
                <label>{label}</label>
                <div className="input-border"></div>
              </div>
            </div>
          ))}

          {/* Password */}
          <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
            <div className="input-wrapper">
              <div className="input-icon">🔒</div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                required
              />
              <label>Password</label>
              <button type="button" className="password-visibility"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              <div className="input-border"></div>
            </div>
            {formData.password && (
              <div className="strength-indicator">
                <div className="strength-bars">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`strength-bar ${i < passwordStrength ? 'active' : ''}`}
                      style={{ backgroundColor: i < passwordStrength ? strengthColor[passwordStrength] : 'rgba(255,255,255,0.1)' }}>
                    </div>
                  ))}
                </div>
                <div className="strength-text" style={{ color: strengthColor[passwordStrength] }}>
                  {strengthLabel[passwordStrength]}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
            <div className="input-wrapper">
              <div className="input-icon">🔐</div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                required
              />
              <label>Confirm Password</label>
              <button type="button" className="password-visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
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
              <input type="checkbox" checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)} />
              <span className="checkmark"></span>
              <span className="checkbox-text">
                I agree to <a href="#">Terms</a> &amp; <a href="#">Privacy</a>
              </span>
            </label>
          </div>

          <button type="submit" id="register-submit-btn" className="submit-btn"
            disabled={!isFormValid || isLoading}>
            {isLoading ? (
              <div className="btn-loader"><span></span><span></span><span></span></div>
            ) : 'Create Account'}
          </button>
        </form>

        <div className="login-link">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
