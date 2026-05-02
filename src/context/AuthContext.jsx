// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Check for stored auth token on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (storedUser && token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const decoded = JSON.parse(atob(token));
          if (decoded.exp && decoded.exp > Date.now()) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch {
          resolve(false);
        }
      }, 500);
    });
  };

  const generateToken = (userData, rememberMe = false) => {
    return btoa(JSON.stringify({ 
      userId: userData.id, 
      email: userData.email,
      name: userData.name,
      exp: Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000
    }));
  };

  const saveUserToStorage = (userData, token, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('authToken', token);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
  };

  // Email/Password Login
  const login = async (email, password, rememberMe = false) => {
    setError(null);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return { success: false, error: 'Please fill in all fields' };
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === email && u.password === password);
        
        if (existingUser) {
          const userData = { 
            id: existingUser.id,
            email: existingUser.email, 
            name: existingUser.name,
            provider: 'email',
            avatar: `https://ui-avatars.com/api/?background=D4AF37&color=fff&name=${existingUser.name}`,
            joinDate: existingUser.joinDate || new Date().toISOString()
          };
          
          const token = generateToken(userData, rememberMe);
          saveUserToStorage(userData, token, rememberMe);
          
          setUser(userData);
          setIsAuthenticated(true);
          
          resolve({ success: true, user: userData, message: 'Login successful!' });
        } else {
          const errorMsg = 'Invalid email or password';
          setError(errorMsg);
          resolve({ success: false, error: errorMsg });
        }
      }, 1000);
    });
  };

  // Email/Password Registration
  const register = async (name, email, password) => {
    setError(null);
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return { success: false, error: 'Please fill in all fields' };
    }
    
    if (name.length < 2) {
      setError('Name must be at least 2 characters long');
      return { success: false, error: 'Name must be at least 2 characters long' };
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return { success: false, error: 'Password must be at least 6 characters long' };
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
          const errorMsg = 'Email already registered';
          setError(errorMsg);
          resolve({ success: false, error: errorMsg });
          return;
        }
        
        const userData = { 
          id: Date.now(),
          email, 
          name: name,
          provider: 'email',
          avatar: `https://ui-avatars.com/api/?background=D4AF37&color=fff&name=${name}`,
          joinDate: new Date().toISOString()
        };
        
        users.push({ ...userData, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        const token = generateToken(userData, true);
        saveUserToStorage(userData, token, true);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        resolve({ success: true, user: userData, message: 'Registration successful!' });
      }, 1000);
    });
  };

  // Google Sign In - Enhanced with Account Selection
  const signInWithGoogle = async () => {
    setError(null);
    
    return new Promise((resolve) => {
      // Simulate Google Account Selection Popup
      const mockGoogleAccounts = [
        { id: 1, email: 'personal@gmail.com', name: 'John Personal', picture: null },
        { id: 2, email: 'business@company.com', name: 'Business Account', picture: null },
        { id: 3, email: 'work@organization.com', name: 'Work Account', picture: null }
      ];
      
      // Create a simulated account selection dialog
      const accountList = mockGoogleAccounts.map((acc, index) => 
        `${index + 1}. ${acc.name} (${acc.email})`
      ).join('\n');
      
      const selectedIndex = prompt(
        `Select Google Account:\n\n${accountList}\n\nEnter number (1-3) or click Cancel to add new account:`,
        '1'
      );
      
      setTimeout(() => {
        if (selectedIndex && !isNaN(selectedIndex)) {
          const index = parseInt(selectedIndex) - 1;
          if (index >= 0 && index < mockGoogleAccounts.length) {
            const selectedAccount = mockGoogleAccounts[index];
            
            const googleUser = {
              id: 'google_' + Date.now(),
              email: selectedAccount.email,
              name: selectedAccount.name,
              provider: 'google',
              avatar: `https://ui-avatars.com/api/?background=D4AF37&color=fff&name=${selectedAccount.name.replace(' ', '+')}`,
              joinDate: new Date().toISOString(),
              verified: true,
              emailVerified: true
            };
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(u => u.email === googleUser.email);
            
            if (!existingUser) {
              users.push(googleUser);
              localStorage.setItem('users', JSON.stringify(users));
            } else {
              // Update existing user with Google provider info
              Object.assign(existingUser, googleUser);
              localStorage.setItem('users', JSON.stringify(users));
            }
            
            const token = generateToken(googleUser, true);
            saveUserToStorage(googleUser, token, true);
            
            setUser(googleUser);
            setIsAuthenticated(true);
            
            resolve({ 
              success: true, 
              user: googleUser,
              message: `Welcome ${googleUser.name}! Google sign in successful.`
            });
          } else {
            resolve({ success: false, error: 'Invalid account selection. Please try again.' });
          }
        } else if (selectedIndex === null) {
          // User cancelled - try adding new account
          const addNewAccount = confirm('Add a new Google account?\n\nClick OK to add new account, Cancel to go back.');
          
          if (addNewAccount) {
            const newEmail = prompt('Enter your Google email address:', 'newuser@gmail.com');
            if (newEmail && newEmail.includes('@')) {
              const newName = prompt('Enter your name:', newEmail.split('@')[0]);
              
              const googleUser = {
                id: 'google_' + Date.now(),
                email: newEmail,
                name: newName || newEmail.split('@')[0],
                provider: 'google',
                avatar: `https://ui-avatars.com/api/?background=D4AF37&color=fff&name=${(newName || newEmail.split('@')[0]).replace(' ', '+')}`,
                joinDate: new Date().toISOString(),
                verified: true,
                emailVerified: true
              };
              
              const users = JSON.parse(localStorage.getItem('users') || '[]');
              users.push(googleUser);
              localStorage.setItem('users', JSON.stringify(users));
              
              const token = generateToken(googleUser, true);
              saveUserToStorage(googleUser, token, true);
              
              setUser(googleUser);
              setIsAuthenticated(true);
              
              resolve({ success: true, user: googleUser, message: 'Google account added and signed in!' });
            } else {
              resolve({ success: false, error: 'Invalid email address. Sign in cancelled.' });
            }
          } else {
            resolve({ success: false, error: 'Google sign in cancelled.' });
          }
        } else {
          resolve({ success: false, error: 'Invalid selection. Please try again.' });
        }
      }, 500);
    });
  };

  // Apple Sign In - Enhanced with Verification
  const signInWithApple = async () => {
    setError(null);
    
    return new Promise((resolve) => {
      // Simulate Apple ID verification
      const appleID = prompt(
        'Sign in with Apple\n\nEnter your Apple ID email address:',
        'appleid@icloud.com'
      );
      
      setTimeout(() => {
        if (appleID && appleID.includes('@')) {
          // Simulate sending verification code
          const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
          console.log(`Apple verification code for ${appleID}: ${verificationCode}`);
          
          const enteredCode = prompt(
            `A verification code has been sent to ${appleID}\n\nEnter the 6-digit verification code:`,
            verificationCode
          );
          
          if (enteredCode === verificationCode) {
            // Verification successful
            const appleUser = {
              id: 'apple_' + Date.now(),
              email: appleID,
              name: appleID.split('@')[0],
              provider: 'apple',
              avatar: `https://ui-avatars.com/api/?background=D4AF37&color=fff&name=${appleID.split('@')[0]}`,
              joinDate: new Date().toISOString(),
              verified: true,
              emailVerified: true
            };
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(u => u.email === appleUser.email);
            
            if (!existingUser) {
              users.push(appleUser);
              localStorage.setItem('users', JSON.stringify(users));
            } else {
              Object.assign(existingUser, appleUser);
              localStorage.setItem('users', JSON.stringify(users));
            }
            
            const token = generateToken(appleUser, true);
            saveUserToStorage(appleUser, token, true);
            
            setUser(appleUser);
            setIsAuthenticated(true);
            
            resolve({ 
              success: true, 
              user: appleUser,
              message: `Welcome ${appleUser.name}! Apple sign in successful.`
            });
          } else {
            resolve({ success: false, error: 'Invalid verification code. Apple sign in failed.' });
          }
        } else if (appleID === null) {
          resolve({ success: false, error: 'Apple sign in cancelled.' });
        } else {
          resolve({ success: false, error: 'Please enter a valid Apple ID email address.' });
        }
      }, 500);
    });
  };

  // Send Phone OTP
  const sendPhoneOTP = async (phoneNumber) => {
    setError(null);
    
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return { success: false, error: 'Please enter your phone number' };
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        
        sessionStorage.setItem('phoneOTP', generatedOTP);
        sessionStorage.setItem('phoneNumber', phoneNumber);
        
        console.log(`OTP for ${phoneNumber}: ${generatedOTP}`);
        alert(`Demo OTP: ${generatedOTP}\n\nIn production, this would be sent via SMS to ${phoneNumber}`);
        
        resolve({ 
          success: true, 
          message: 'OTP sent successfully!',
          verificationId: 'demo_verification_id'
        });
      }, 1000);
    });
  };

  // Verify Phone OTP
  const verifyPhoneOTP = async (otp) => {
    setError(null);
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return { success: false, error: 'Please enter a valid 6-digit OTP' };
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedOTP = sessionStorage.getItem('phoneOTP');
        const phoneNumber = sessionStorage.getItem('phoneNumber');
        
        if (storedOTP === otp) {
          const phoneUser = {
            id: 'phone_' + Date.now(),
            email: null,
            phoneNumber: phoneNumber,
            name: `User_${phoneNumber.slice(-4)}`,
            provider: 'phone',
            avatar: `https://ui-avatars.com/api/?background=D4AF37&color=fff&name=Phone+User`,
            joinDate: new Date().toISOString(),
            verified: true
          };
          
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const existingUser = users.find(u => u.phoneNumber === phoneNumber);
          
          if (!existingUser) {
            users.push(phoneUser);
            localStorage.setItem('users', JSON.stringify(users));
          }
          
          const token = generateToken(phoneUser, true);
          saveUserToStorage(phoneUser, token, true);
          
          setUser(phoneUser);
          setIsAuthenticated(true);
          
          sessionStorage.removeItem('phoneOTP');
          sessionStorage.removeItem('phoneNumber');
          
          resolve({ 
            success: true, 
            user: phoneUser,
            message: 'Phone verification successful!'
          });
        } else {
          const errorMsg = 'Invalid OTP. Please try again.';
          setError(errorMsg);
          resolve({ success: false, error: errorMsg });
        }
      }, 1000);
    });
  };

  // Forgot Password
  const resetPassword = async (email) => {
    setError(null);
    
    if (!email) {
      setError('Please enter your email address');
      return { success: false, error: 'Please enter your email address' };
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(u => u.email === email);
        
        if (userExists) {
          const resetToken = btoa(JSON.stringify({ email, exp: Date.now() + 3600000 }));
          localStorage.setItem(`reset_${email}`, resetToken);
          
          console.log(`Password reset link for ${email}: http://localhost:3000/reset-password?token=${resetToken}`);
          
          alert(`Demo: Password reset link sent to ${email}\n\nIn production, this would send an actual email with reset instructions.`);
          
          resolve({ 
            success: true, 
            message: 'Password reset email sent! Please check your inbox.' 
          });
        } else {
          const errorMsg = 'No account found with this email address';
          setError(errorMsg);
          resolve({ success: false, error: errorMsg });
        }
      }, 1500);
    });
  };

  // Logout
  const logout = () => {
    clearStorage();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setConfirmationResult(null);
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...updates };
        
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(updatedUser));
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates };
          localStorage.setItem('users', JSON.stringify(users));
        }
        
        setUser(updatedUser);
        resolve({ success: true, user: updatedUser });
      }, 500);
    });
  };

  // Change password
  const changePassword = async (oldPassword, newPassword) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters' };
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
          if (users[userIndex].password === oldPassword) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            resolve({ success: true, message: 'Password changed successfully' });
          } else {
            resolve({ success: false, error: 'Current password is incorrect' });
          }
        } else {
          resolve({ success: false, error: 'User not found' });
        }
      }, 1000);
    });
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    signInWithGoogle,
    signInWithApple,
    sendPhoneOTP,
    verifyPhoneOTP,
    resetPassword,
    logout,
    updateUserProfile,
    changePassword,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}