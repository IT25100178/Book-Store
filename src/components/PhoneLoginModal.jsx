// src/components/PhoneLoginModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './PhoneLoginModal.css';

function PhoneLoginModal({ isOpen, onClose, onSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const { sendPhoneOTP, verifyPhoneOTP } = useAuth();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const resetModal = () => {
    setPhoneNumber('');
    setOtp('');
    setStep('phone');
    setConfirmationResult(null);
    setError('');
    setIsLoading(false);
    setTimer(0);
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleSendOTP = async () => {
    const rawPhone = phoneNumber.replace(/\D/g, '');
    
    if (!rawPhone || rawPhone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    // Add country code (default to +1 for US)
    const fullPhoneNumber = `+1${rawPhone}`;
    
    setIsLoading(true);
    setError('');
    
    const result = await sendPhoneOTP(fullPhoneNumber);
    
    if (result.success) {
      setConfirmationResult(result.confirmationResult);
      setStep('otp');
      setTimer(60);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const result = await verifyPhoneOTP(otp);
    
    if (result.success) {
      if (onSuccess) {
        onSuccess(result.user);
      }
      onClose();
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    
    setIsLoading(true);
    setError('');
    
    const rawPhone = phoneNumber.replace(/\D/g, '');
    const fullPhoneNumber = `+1${rawPhone}`;
    const result = await sendPhoneOTP(fullPhoneNumber);
    
    if (result.success) {
      setConfirmationResult(result.confirmationResult);
      setTimer(60);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (step === 'phone') {
        handleSendOTP();
      } else {
        handleVerifyOTP();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="phone-modal-overlay" onClick={onClose}>
      <div className="phone-modal" onClick={(e) => e.stopPropagation()}>
        <div className="phone-modal-header">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '8px' }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Sign in with Phone
          </h3>
          <button className="phone-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="phone-modal-body">
          {step === 'phone' ? (
            <>
              <div className="phone-icon-wrapper">
                <div className="phone-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
              </div>
              <p>Enter your phone number to receive a verification code</p>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onKeyPress={handleKeyPress}
                className="phone-input-field"
                autoFocus
              />
              <div className="phone-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>We'll send you a 6-digit code via SMS</span>
              </div>
              {error && <div className="phone-error">{error}</div>}
              <button 
                className="phone-submit-btn" 
                onClick={handleSendOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="phone-spinner"></div>
                ) : (
                  <>
                    Send Verification Code
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="phone-icon-wrapper">
                <div className="phone-icon success">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2"/>
                    <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <p>Enter the 6-digit code sent to</p>
              <div className="phone-number-display">{phoneNumber}</div>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={handleKeyPress}
                className="phone-otp-input"
                maxLength="6"
                autoFocus
              />
              {error && <div className="phone-error">{error}</div>}
              <div className="phone-actions">
                <button 
                  className="phone-resend-btn" 
                  onClick={handleResendOTP}
                  disabled={timer > 0}
                >
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                </button>
                <button 
                  className="phone-submit-btn" 
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="phone-spinner"></div>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhoneLoginModal;