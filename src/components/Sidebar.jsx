import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiShoppingCart, FiUser, FiTag, FiActivity, FiStar, FiPercent, FiLayout, FiShield, FiSettings, FiBarChart2, FiPackage, FiGlobe } from 'react-icons/fi';

const navItems = [
    { name: 'Dashboard',   path: '/admin/dashboard',   icon: <FiHome /> },
    { name: 'Books',       path: '/admin/books',       icon: <FiBook /> },
    { name: 'Orders',      path: '/admin/orders',      icon: <FiShoppingCart /> },
    { name: 'Stock',       path: '/admin/stock',       icon: <FiPackage /> },
    { name: 'Reports',     path: '/admin/reports',     icon: <FiBarChart2 /> },
    { name: 'Promotions',  path: '/admin/promotions',  icon: <FiPercent /> },
    { name: 'Reviews',     path: '/admin/reviews',     icon: <FiStar /> },
    { name: 'Authors',     path: '/admin/authors',     icon: <FiUser /> },
    { name: 'Publishers',  path: '/admin/publishers',  icon: <FiGlobe /> },
    { name: 'Genres',      path: '/admin/genres',      icon: <FiTag /> },
    { name: 'Users',       path: '/admin/users',       icon: <FiUsers /> },
    { name: 'Roles',       path: '/admin/roles',       icon: <FiShield /> },
    { name: 'Storefront',  path: '/admin/cms',         icon: <FiLayout /> },
    { name: 'Settings',    path: '/admin/settings',    icon: <FiSettings /> },
    { name: 'Activity',    path: '/admin/logs',        icon: <FiActivity /> },
];

const Sidebar = ({ collapsed }) => (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
            {collapsed
                ? <span style={{ color: '#93C5FD', fontWeight: 800 }}>LB</span>
                : <span className="sidebar-brand-text">Lanka<span>Books</span></span>}
        </div>
        <nav className="sidebar-nav">
            {navItems.map(item => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.name : undefined}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                </NavLink>
            ))}
        </nav>
        <div className="sidebar-footer">© 2026 LankaBooks Admin</div>
    </div>
);

export default Sidebar;
