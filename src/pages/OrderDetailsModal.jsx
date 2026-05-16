import React from 'react';
import { FiX, FiInfo, FiAlertTriangle, FiPrinter, FiCheckCircle, FiClock, FiTruck, FiPackage } from 'react-icons/fi';

const STATUS_PIPELINE = ['PENDING', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED'];

const StatusPipeline = ({ current }) => {
    const idx = STATUS_PIPELINE.indexOf((current || '').toUpperCase());
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '20px 0' }}>
            {STATUS_PIPELINE.map((s, i) => {
                const done = i <= idx;
                const active = i === idx;
                return (
                    <React.Fragment key={s}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: done ? (active ? '#FACC15' : '#4ADE80') : 'var(--bg-hover)',
                                border: `2px solid ${done ? (active ? '#FACC15' : '#4ADE80') : 'var(--border-color)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, color: done ? '#000' : 'var(--text-muted)',
                                transition: 'all 0.3s'
                            }}>
                                {done && !active ? <FiCheckCircle size={14} /> :
                                    s === 'PENDING' ? <FiClock size={14} /> :
                                        s === 'SHIPPED' ? <FiTruck size={14} /> :
                                            s === 'DELIVERED' ? <FiCheckCircle size={14} /> :
                                                <FiPackage size={14} />}
                            </div>
                            <div style={{ fontSize: 10, color: done ? (active ? '#FACC15' : '#4ADE80') : 'var(--text-muted)', fontWeight: active ? 700 : 500, whiteSpace: 'nowrap' }}>
                                {s}
                            </div>
                        </div>
                        {i < STATUS_PIPELINE.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: i < idx ? '#4ADE80' : 'var(--bg-hover)', margin: '0 4px', marginBottom: 20, transition: 'background 0.3s' }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const printInvoice = (order, booksMap) => {
    const items = (order.bookIds || []).map(id => booksMap[id]).filter(Boolean);
    const html = `
        <html>
        <head>
            <title>Invoice - Order ${order.id}</title>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #1a1a2e; }
                h1 { color: #1E40AF; margin: 0; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1E40AF; padding-bottom: 20px; margin-bottom: 20px; }
                .brand { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
                .brand span { color: #1E40AF; }
                .label { color: #64748B; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 3px; }
                .value { font-size: 14px; font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #1E40AF; color: white; padding: 10px; text-align: left; font-size: 13px; }
                td { padding: 10px; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
                tr:last-child td { border: none; }
                .total { text-align: right; margin-top: 20px; font-size: 20px; font-weight: 800; color: #1E40AF; }
                .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E2E8F0; text-align: center; color: #94A3B8; font-size: 12px; }
                .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
                .status-delivered { background: #DCFCE7; color: #166534; }
                .status-shipped { background: #DBEAFE; color: #1E40AF; }
                .status-pending { background: #FEF3C7; color: #92400E; }
                .status-cancelled { background: #FEE2E2; color: #991B1B; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <div class="brand">Lanka<span>Books</span></div>
                    <div style="color:#64748B;font-size:13px;margin-top:4px">Your Premium Online Bookstore</div>
                </div>
                <div style="text-align:right">
                    <div style="font-size:22px;font-weight:800;color:#64748B">INVOICE</div>
                    <div style="font-size:12px;color:#94A3B8;margin-top:4px">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>

            <div style="display:flex;gap:40px;margin-bottom:20px">
                <div>
                    <div class="label">Order ID</div>
                    <div class="value" style="font-family:monospace">${order.id}</div>
                </div>
                <div>
                    <div class="label">Order Date</div>
                    <div class="value">${new Date(order.orderDate).toLocaleDateString()}</div>
                </div>
                <div>
                    <div class="label">Status</div>
                    <div class="value">
                        <span class="badge status-${(order.status || '').toLowerCase()}">${order.status}</span>
                    </div>
                </div>
            </div>

            <table>
                <thead>
                    <tr><th>#</th><th>Book</th><th>Author</th><th>Category</th><th style="text-align:right">Price</th></tr>
                </thead>
                <tbody>
                    ${items.map((b, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td><strong>${b.title}</strong></td>
                            <td>${b.author}</td>
                            <td>${b.category || '—'}</td>
                            <td style="text-align:right;font-weight:bold;color:#1E40AF">$${(b.price || 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total">Total: $${(order.totalPrice || 0).toFixed(2)}</div>

            <div class="footer">
                Thank you for shopping with LankaBooks! &nbsp;|&nbsp; support@lankabooks.com &nbsp;|&nbsp; www.lankabooks.com
            </div>
        </body>
        </html>
    `;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
};

const OrderDetailsModal = ({ isOpen, order, booksMap, onClose }) => {
    if (!isOpen || !order) return null;

    const statusClass = {
        'PENDING': 'badge-pending', 'SHIPPED': 'badge-active',
        'DELIVERED': 'badge-active', 'CANCELLED': 'badge-banned', 'PROCESSING': 'badge-pending', 'PACKED': 'badge-pending'
    }[order.status] || 'badge-pending';

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: 600 }}>
                <div className="modal-header">
                    <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiInfo /> Order <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-light)' }}>#{order.id?.slice(0, 8)}</span>
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => printInvoice(order, booksMap)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FiPrinter /> Print Invoice
                        </button>
                        <button className="modal-close" onClick={onClose}><FiX /></button>
                    </div>
                </div>

                <div className="modal-body">
                    {/* Order Summary */}
                    <div style={{ marginBottom: 20, padding: 16, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>Order Date</div>
                            <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 13 }}>{new Date(order.orderDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>Status</div>
                            <span className={`badge ${statusClass}`}>{order.status}</span>
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>Total</div>
                            <div style={{ color: '#4ADE80', fontWeight: 800, fontSize: 18 }}>${(order.totalPrice || 0).toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Status Pipeline */}
                    <StatusPipeline current={order.status} />

                    {/* Items */}
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiPackage color="#FACC15" /> Ordered Items ({order.bookIds?.length || 0})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {order.bookIds?.map((bookId, index) => {
                            const book = booksMap[bookId];
                            if (!book) return (
                                <div key={`${bookId}-${index}`} style={{ display: 'flex', alignItems: 'center', padding: 12, border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--bg-card)' }}>
                                    <div style={{ color: 'var(--text-light)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <FiAlertTriangle color="#F87171" /> Book not found (ID: {bookId})
                                    </div>
                                </div>
                            );
                            return (
                                <div key={`${bookId}-${index}`} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--bg-hover)', borderRadius: 10, background: 'var(--bg-card)', gap: 14 }}>
                                    <img src={book.coverImageUrl || 'https://placehold.co/40x56/161616/FACC15?text=B'}
                                        alt={book.title} style={{ width: 40, height: 56, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-color)' }}
                                        onError={e => { e.target.src = 'https://placehold.co/40x56/161616/FACC15?text=B'; }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>{book.title}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{book.author} · {book.category || 'N/A'}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, color: '#4ADE80', fontSize: 15 }}>${(book.price || 0).toFixed(2)}</div>
                                        <div style={{ fontSize: 11, color: book.stockQuantity < 5 ? '#F87171' : 'var(--text-muted)', marginTop: 2 }}>
                                            Stock: {book.stockQuantity} {book.stockQuantity < 5 && '⚠'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
