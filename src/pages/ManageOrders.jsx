import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import BookSorter from '../utils/BookSorter';
import OrderDetailsModal from './OrderDetailsModal';
import { FiRotateCw, FiClock, FiDollarSign } from 'react-icons/fi';

const STATUS_OPTIONS = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const ManageOrders = ({ showToast }) => {
    const [orders, setOrders] = useState([]);
    const [booksMap, setBooksMap] = useState({});
    const [displayed, setDisplayed] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadData = useCallback(() => {
        setLoading(true);
        Promise.all([api.getOrders(), api.getBooks()])
            .then(([ordersRes, booksRes]) => {
                setOrders(ordersRes.data);
                
                const bMap = {};
                booksRes.data.forEach(b => bMap[b.id] = b);
                setBooksMap(bMap);
                
                setLoading(false);
            })
            .catch(() => { 
                showToast("Failed to load orders or books", "error"); 
                setLoading(false); 
            });
    }, [showToast]);

    useEffect(() => { loadData(); }, [loadData]);

    // Re-filter whenever orders or activeFilter changes
    useEffect(() => {
        if (activeFilter === 'ALL') {
            setDisplayed(orders);
        } else {
            setDisplayed(orders.filter(o => o.status === activeFilter));
        }
    }, [orders, activeFilter]);

    const handleClientSort = (key) => {
        const sorted = BookSorter.quickSort([...displayed], key);
        setDisplayed(sorted);
        showToast(`Sorted by ${key} (QuickSort)`);
    };

    const handleStatusUpdate = (id, newStatus) => {
        api.updateOrderStatus(id, newStatus)
            .then(() => { showToast("Order status updated"); loadData(); })
            .catch(() => showToast("Error updating order", "error"));
    };

    const getStatusClass = (status) => {
        const map = { PENDING: 'badge-pending', SHIPPED: 'badge-shipped', DELIVERED: 'badge-delivered', CANCELLED: 'badge-cancelled' };
        return map[status] || 'badge';
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Manage Orders</h1>
                <div className="tab-group">
                    {['ALL', ...STATUS_OPTIONS].map(s => (
                        <button key={s} className={`tab-btn ${activeFilter === s ? 'active' : ''}`} onClick={() => setActiveFilter(s)}>{s}</button>
                    ))}
                </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px', background:'var(--bg-card)', padding:'14px 20px', borderRadius:'10px', border:'1px solid #E2E8F0' }}>
                <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text-muted)' }}>Client-Side QuickSort:</span>
                <button className="btn btn-secondary btn-sm" onClick={() => handleClientSort('orderDate')}><FiClock /> By Date</button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleClientSort('totalPrice')}><FiDollarSign /> By Price</button>
                <span style={{fontSize:'12px',color:'var(--text-light)',marginLeft:'auto'}}>
                    Showing {displayed.length} order{displayed.length !== 1 ? 's' : ''}
                    {activeFilter !== 'ALL' && ` · Filter: ${activeFilter}`}
                </span>
            </div>

            <div className="card">
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading"><FiRotateCw className="animate-spin" /> Loading orders...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Update Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.length === 0 ? (
                                    <tr><td colSpan="5" style={{textAlign:'center',padding:'40px',color:'var(--text-light)'}}>No orders for this filter.</td></tr>
                                ) : displayed.map(order => (
                                    <tr key={order.id} className={order.status === 'PENDING' ? 'tr-pending' : ''}>
                                        <td 
                                            style={{fontFamily:'monospace',fontSize:'12px',color:'#2563EB',fontWeight:600,cursor:'pointer',textDecoration:'underline'}}
                                            onClick={() => openOrderDetails(order)}
                                            title="Click to view full order details"
                                        >
                                            {order.id}
                                        </td>
                                        <td>{new Date(order.orderDate).toLocaleString()}</td>
                                        <td style={{fontWeight:700,color:'#1E40AF'}}>${(order.totalPrice || 0).toFixed(2)}</td>
                                        <td><span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={e => handleStatusUpdate(order.id, e.target.value)}
                                                className="sort-select"
                                                style={{fontSize:'13px'}}
                                            >
                                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <OrderDetailsModal 
                isOpen={isModalOpen} 
                order={selectedOrder} 
                booksMap={booksMap} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};

export default ManageOrders;
