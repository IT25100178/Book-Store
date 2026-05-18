// src/components/auth/Register.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';
import './Login.css'; // Re-use the animated layout styles!

const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const pupilRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      style={{
        width: `${size}px`, height: `${size}px`,
        backgroundColor: pupilColor, borderRadius: '50%',
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "black", isBlinking = false, forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const eyeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      style={{
        width: `${size}px`, height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease-out', overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          style={{
            width: `${pupilSize}px`, height: `${pupilSize}px`,
            backgroundColor: pupilColor, borderRadius: '50%',
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};


function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [focusedField,        setFocusedField]        = useState(null);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error,               setError]               = useState('');
  const [isLoading,           setIsLoading]           = useState(false);
  const [showSuccess,         setShowSuccess]         = useState(false);
  const [agreeTerms,          setAgreeTerms]          = useState(false);

  // Animation States
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  
  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Mouse Tracking
  useEffect(() => {
    const handleMouseMove = (e) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking
  useEffect(() => {
    const scheduleBlink = () => {
      const timeout = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => { setIsPurpleBlinking(false); scheduleBlink(); }, 150);
      }, Math.random() * 4000 + 3000);
      return timeout;
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const scheduleBlink = () => {
      const timeout = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => { setIsBlackBlinking(false); scheduleBlink(); }, 150);
      }, Math.random() * 4000 + 3000);
      return timeout;
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Is Typing
  const isTyping = focusedField !== null;
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Peeking
  const isPasswordRevealed = showPassword || showConfirmPassword;
  const hasPasswordInput = formData.password.length > 0 || formData.confirmPassword.length > 0;
  useEffect(() => {
    if (hasPasswordInput && isPasswordRevealed) {
      const schedulePeek = () => {
        const timeout = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => setIsPurplePeeking(false), 800);
        }, Math.random() * 3000 + 2000);
        return timeout;
      };
      const t = schedulePeek();
      return () => clearTimeout(t);
    } else {
      setIsPurplePeeking(false);
    }
  }, [hasPasswordInput, isPasswordRevealed]);

  const calculatePosition = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) strength++;
    if (pwd.match(/[0-9]/)) strength++;
    if (pwd.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const strengthLabel = ['Very Weak','Weak','Fair','Good','Strong'];
  const strengthColor = ['#ef4444','#f97316','#eab308','#84cc16','#10b981'];

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.name && formData.email && formData.password && passwordsMatch && agreeTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) { setError('Please agree to the Terms and Conditions'); return; }
    if (!passwordsMatch) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }

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
    <div className="login-split-container">
      {/* ── Left Animated Characters Section ── */}
      <div className="login-characters-section">
        <div className="characters-header">
          <div className="logo-circle" style={{ width: 40, height: 40 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="brand-text">Luxury Books</span>
        </div>

        <div className="characters-stage">
          <div style={{ position: 'relative', width: '550px', height: '400px' }}>
            {/* Purple Character */}
            <div 
              ref={purpleRef}
              className="cartoon-char"
              style={{
                left: '70px', width: '180px',
                height: (isTyping || (hasPasswordInput && !isPasswordRevealed)) ? '440px' : '400px',
                backgroundColor: '#6C3FF5', borderRadius: '10px 10px 0 0', zIndex: 1,
                transform: (hasPasswordInput && isPasswordRevealed)
                  ? `skewX(0deg)`
                  : (isTyping || (hasPasswordInput && !isPasswordRevealed))
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
              }}
            >
              <div 
                className="eyes-wrapper"
                style={{
                  left: (hasPasswordInput && isPasswordRevealed) ? '20px' : isLookingAtEachOther ? '55px' : `${45 + purplePos.faceX}px`,
                  top: (hasPasswordInput && isPasswordRevealed) ? '35px' : isLookingAtEachOther ? '65px' : `${40 + purplePos.faceY}px`,
                  gap: '2rem'
                }}
              >
                <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking}
                  forceLookX={(hasPasswordInput && isPasswordRevealed) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={(hasPasswordInput && isPasswordRevealed) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking}
                  forceLookX={(hasPasswordInput && isPasswordRevealed) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={(hasPasswordInput && isPasswordRevealed) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
              </div>
            </div>

            {/* Black Character */}
            <div 
              ref={blackRef}
              className="cartoon-char"
              style={{
                left: '240px', width: '120px', height: '310px',
                backgroundColor: '#2D2D2D', borderRadius: '8px 8px 0 0', zIndex: 2,
                transform: (hasPasswordInput && isPasswordRevealed)
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : (isTyping || (hasPasswordInput && !isPasswordRevealed))
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
              }}
            >
              <div 
                className="eyes-wrapper"
                style={{
                  left: (hasPasswordInput && isPasswordRevealed) ? '10px' : isLookingAtEachOther ? '32px' : `${26 + blackPos.faceX}px`,
                  top: (hasPasswordInput && isPasswordRevealed) ? '28px' : isLookingAtEachOther ? '12px' : `${32 + blackPos.faceY}px`,
                  gap: '1.5rem'
                }}
              >
                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking}
                  forceLookX={(hasPasswordInput && isPasswordRevealed) ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={(hasPasswordInput && isPasswordRevealed) ? -4 : isLookingAtEachOther ? -4 : undefined} />
                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking}
                  forceLookX={(hasPasswordInput && isPasswordRevealed) ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={(hasPasswordInput && isPasswordRevealed) ? -4 : isLookingAtEachOther ? -4 : undefined} />
              </div>
            </div>

            {/* Orange Character */}
            <div 
              ref={orangeRef}
              className="cartoon-char"
              style={{
                left: '0px', width: '240px', height: '200px', zIndex: 3,
                backgroundColor: '#FF9B6B', borderRadius: '120px 120px 0 0',
                transform: (hasPasswordInput && isPasswordRevealed) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
              }}
            >
              <div 
                className="eyes-wrapper"
                style={{
                  left: (hasPasswordInput && isPasswordRevealed) ? '50px' : `${82 + (orangePos.faceX || 0)}px`,
                  top: (hasPasswordInput && isPasswordRevealed) ? '85px' : `${90 + (orangePos.faceY || 0)}px`,
                  gap: '2rem'
                }}
              >
                <Pupil size={12} forceLookX={(hasPasswordInput && isPasswordRevealed) ? -5 : undefined} forceLookY={(hasPasswordInput && isPasswordRevealed) ? -4 : undefined} />
                <Pupil size={12} forceLookX={(hasPasswordInput && isPasswordRevealed) ? -5 : undefined} forceLookY={(hasPasswordInput && isPasswordRevealed) ? -4 : undefined} />
              </div>
            </div>

            {/* Yellow Character */}
            <div 
              ref={yellowRef}
              className="cartoon-char"
              style={{
                left: '310px', width: '140px', height: '230px', zIndex: 4,
                backgroundColor: '#E8D754', borderRadius: '70px 70px 0 0',
                transform: (hasPasswordInput && isPasswordRevealed) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
              }}
            >
              <div 
                className="eyes-wrapper"
                style={{
                  left: (hasPasswordInput && isPasswordRevealed) ? '20px' : `${52 + (yellowPos.faceX || 0)}px`,
                  top: (hasPasswordInput && isPasswordRevealed) ? '35px' : `${40 + (yellowPos.faceY || 0)}px`,
                  gap: '1.5rem'
                }}
              >
                <Pupil size={12} forceLookX={(hasPasswordInput && isPasswordRevealed) ? -5 : undefined} forceLookY={(hasPasswordInput && isPasswordRevealed) ? -4 : undefined} />
                <Pupil size={12} forceLookX={(hasPasswordInput && isPasswordRevealed) ? -5 : undefined} forceLookY={(hasPasswordInput && isPasswordRevealed) ? -4 : undefined} />
              </div>
              <div 
                className="yellow-mouth"
                style={{
                  left: (hasPasswordInput && isPasswordRevealed) ? '10px' : `${40 + (yellowPos.faceX || 0)}px`,
                  top: (hasPasswordInput && isPasswordRevealed) ? '88px' : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="characters-footer">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
          <Link to="/">Contact</Link>
        </div>
      </div>

      {/* ── Right Register Section ── */}
      <div className="login-form-section">
        
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
              <h3>Account Created!</h3>
              <p>Redirecting to home…</p>
              <div className="loading-spinner"></div>
            </div>
          </div>
        )}

        {/* Register Form UI */}
        <div className="login-card split-layout-card" style={{ maxWidth: '500px', padding: '1.5rem 2rem' }}>
          <div className="login-header text-left" style={{ marginBottom: '1.5rem' }}>
            <h2>Create Account</h2>
            <p>Join the luxury reading experience</p>
          </div>

          {error && (
            <div className="error-message">
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

            <div className="terms-wrapper" style={{ marginTop: '0.5rem' }}>
              <label className="custom-checkbox">
                <input type="checkbox" checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)} />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  I agree to <Link to="/">Terms</Link> &amp; <Link to="/">Privacy</Link>
                </span>
              </label>
            </div>

            <button type="submit" id="register-submit-btn" className="login-btn"
              disabled={!isFormValid || isLoading}
              style={{ marginTop: '0.5rem' }}>
              {isLoading ? (
                 <div className="spinner"></div>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="signup-prompt">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
