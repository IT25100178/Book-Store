// Admin Panel App – integrated into main Book-Store frontend
// This wraps the admin panel layout and routes under /admin/*
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import ManageBooks from './pages/ManageBooks';
import ManageUsers from './pages/ManageUsers';
import ManageOrders from './pages/ManageOrders';
import ManageAuthors from './pages/ManageAuthors';
import ManageGenres from './pages/ManageGenres';
import ActivityLog from './pages/ActivityLog';
import ManagePromotions from './pages/ManagePromotions';
import ManageReviews from './pages/ManageReviews';
import ManageCMS from './pages/ManageCMS';
import ManageRoles from './pages/ManageRoles';
import ManageSettings from './pages/ManageSettings';
import Reports from './pages/Reports';
import StockManager from './pages/StockManager';
import ManagePublishers from './pages/ManagePublishers';
import './admin.css';

const AdminLayout = ({ sidebarCollapsed, setSidebarCollapsed, showToast, theme, toggleTheme }) => {
  return (
    <div className="admin-layout">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={`admin-main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <TopBar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} theme={theme} toggleTheme={toggleTheme} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function AdminApp() {
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('admin-theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Cleanup: remove dark class when leaving admin
    return () => document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const showToast = (message, type = 'success') => setToast({ message, type });

  return (
    <>
      <Routes>
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route element={
          <AdminLayout
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            showToast={showToast}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        }>
          <Route path="dashboard" element={<Dashboard showToast={showToast} />} />
          <Route path="books"     element={<ManageBooks showToast={showToast} />} />
          <Route path="authors"   element={<ManageAuthors showToast={showToast} />} />
          <Route path="genres"    element={<ManageGenres showToast={showToast} />} />
          <Route path="users"     element={<ManageUsers showToast={showToast} />} />
          <Route path="orders"    element={<ManageOrders showToast={showToast} />} />
          <Route path="promotions" element={<ManagePromotions showToast={showToast} />} />
          <Route path="reviews"   element={<ManageReviews showToast={showToast} />} />
          <Route path="cms"       element={<ManageCMS showToast={showToast} />} />
          <Route path="roles"     element={<ManageRoles showToast={showToast} />} />
          <Route path="settings"  element={<ManageSettings showToast={showToast} />} />
          <Route path="logs"      element={<ActivityLog showToast={showToast} />} />
          <Route path="reports"   element={<Reports showToast={showToast} />} />
          <Route path="stock"     element={<StockManager showToast={showToast} />} />
          <Route path="publishers" element={<ManagePublishers showToast={showToast} />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </>
  );
}
