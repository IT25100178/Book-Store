// src/context/AuthContext.jsx
// Member 1 – Athethan
// All auth calls now go to the Java backend via api.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth as authApi, users as usersApi } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user,            setUser]            = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ── Restore session on mount ──────────────────────────────────────────────

  useEffect(() => {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (_) {}
    }
    setLoading(false);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const saveUser = (userData, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearSession = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // ── Register – calls Java /api/auth/register ──────────────────────────────

  const register = async (name, email, password, phone = '') => {
    setError(null);
    try {
      const { ok, data } = await authApi.register(name, email, password, phone);
      if (ok && data.success) {
        // Parse user from JSON string returned by Java
        const userData = typeof data.user === 'string' ? JSON.parse(data.user) : data.user;
        saveUser(userData, true);
        return { success: true, user: userData, message: data.message };
      }
      const msg = data.message || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    } catch (err) {
      const msg = 'Cannot connect to server. Is the Java backend running?';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ── Login – calls Java /api/auth/login ────────────────────────────────────

  const login = async (email, password, rememberMe = false) => {
    setError(null);
    try {
      const { ok, data } = await authApi.login(email, password);
      if (ok && data.success) {
        const userData = typeof data.user === 'string' ? JSON.parse(data.user) : data.user;
        saveUser(userData, rememberMe);
        return { success: true, user: userData, message: data.message };
      }
      const msg = data.message || 'Invalid email or password';
      setError(msg);
      return { success: false, error: msg };
    } catch (err) {
      const msg = 'Cannot connect to server. Is the Java backend running?';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ── Forgot Password – calls Java /api/auth/forgot-password ───────────────

  const resetPassword = async (email, newPassword) => {
    setError(null);
    try {
      const { ok, data } = await authApi.forgotPassword(email, newPassword);
      if (ok && data.success) {
        return { success: true, message: data.message };
      }
      const msg = data.message || 'Password reset failed';
      setError(msg);
      return { success: false, error: msg };
    } catch (err) {
      const msg = 'Cannot connect to server.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ── Update Profile – calls Java /api/users/:id ────────────────────────────

  const updateUserProfile = async (updates) => {
    if (!user?.id) return { success: false, error: 'Not logged in' };
    try {
      const { ok, data } = await usersApi.update(user.id, updates);
      if (ok && data.success) {
        const updated = { ...user, ...updates };
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(updated));
        setUser(updated);
        return { success: true };
      }
      return { success: false, error: data.message || 'Update failed' };
    } catch (_) {
      // Offline fallback – update locally only
      const updated = { ...user, ...updates };
      const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      return { success: true };
    }
  };

  // ── Change Password – calls Java /api/users/:id/change-password ───────────

  const changePassword = async (currentPassword, newPassword) => {
    if (!user?.id) return { success: false, error: 'Not logged in' };
    try {
      const { ok, data } = await usersApi.changePassword(user.id, currentPassword, newPassword);
      if (ok && data.success) return { success: true, message: data.message };
      return { success: false, error: data.message || 'Password change failed' };
    } catch (_) {
      return { success: false, error: 'Cannot connect to server.' };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = () => clearSession();

  // ── Context Value ─────────────────────────────────────────────────────────

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    resetPassword,
    logout,
    setError,
    updateUserProfile,
    changePassword,
    // Update user in state/storage after profile edit
    updateLocalUser: (updates) => {
      const updated = { ...user, ...updates };
      const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
