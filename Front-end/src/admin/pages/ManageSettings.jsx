import React, { useState } from 'react';
import { FiSettings, FiMail, FiSave, FiDollarSign, FiGlobe, FiShield, FiAlertTriangle, FiCheck } from 'react-icons/fi';

const ManageSettings = ({ showToast }) => {
    const [settings, setSettings] = useState({
        storeName: 'Luxury Books',
        storeEmail: 'support@luxurybooks.com',
        storePhone: '+94 11 234 5678',
        currency: 'USD',
        taxRate: '8',
        lowStockThreshold: '5',
        maintenanceMode: false,
        orderConfirmEmail: true,
        shippingUpdateEmail: true,
        reviewRequestEmail: true,
        abandonedCartEmail: false,
        newOrderAlert: true,
        lowStockAlert: true,
        newReviewAlert: false,
    });
    const [saved, setSaved] = useState(false);

    const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

    const save = () => {
        setSaved(true);
        showToast('Settings saved successfully!');
        setTimeout(() => setSaved(false), 2000);
    };

    const Toggle = ({ k, label, desc }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-card)', borderRadius: 10, border: `1px solid ${settings[k] ? 'rgba(74,222,128,0.3)' : 'var(--border-color)'}`, transition: 'all 0.2s' }}>
            <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: 14 }}>{label}</div>
                {desc && <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{desc}</div>}
            </div>
            <button onClick={() => set(k, !settings[k])}
                style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: settings[k] ? '#4ADE80' : 'var(--border-color)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-card)', position: 'absolute', top: 3, left: settings[k] ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
            </button>
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Global Settings</h1>
                    <div style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 4 }}>Configure system preferences, emails, and notifications</div>
                </div>
                <button className="btn btn-primary" onClick={save} style={{ minWidth: 140 }}>
                    {saved ? <><FiCheck /> Saved!</> : <><FiSave /> Save Settings</>}
                </button>
            </div>

            {settings.maintenanceMode && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#FCD34D' }}>
                    <FiAlertTriangle />
                    <strong>Maintenance Mode is ON</strong> — the storefront is currently hidden from customers.
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Store Identity */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: '#FACC15', display: 'flex', alignItems: 'center', gap: 8 }}><FiGlobe /> Store Identity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="form-group">
                            <label>Store Name</label>
                            <input className="form-control" value={settings.storeName} onChange={e => set('storeName', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Support Email</label>
                            <input className="form-control" type="email" value={settings.storeEmail} onChange={e => set('storeEmail', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input className="form-control" type="tel" value={settings.storePhone} onChange={e => set('storePhone', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Commerce Settings */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: '#FACC15', display: 'flex', alignItems: 'center', gap: 8 }}><FiDollarSign /> Commerce Settings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="form-group">
                            <label>Currency</label>
                            <select className="form-control" value={settings.currency} onChange={e => set('currency', e.target.value)}>
                                <option value="USD">USD ($) — US Dollar</option>
                                <option value="EUR">EUR (€) — Euro</option>
                                <option value="GBP">GBP (£) — British Pound</option>
                                <option value="LKR">LKR (Rs) — Sri Lankan Rupee</option>
                                <option value="AUD">AUD (A$) — Australian Dollar</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tax Rate (%)</label>
                            <input className="form-control" type="number" min="0" max="100" step="0.1" value={settings.taxRate} onChange={e => set('taxRate', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Low Stock Alert Threshold</label>
                            <input className="form-control" type="number" min="1" value={settings.lowStockThreshold} onChange={e => set('lowStockThreshold', e.target.value)} />
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Alert when stock falls below this number</span>
                        </div>
                    </div>
                </div>

                {/* Email Triggers */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: '#FACC15', display: 'flex', alignItems: 'center', gap: 8 }}><FiMail /> Automated Email Triggers</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Toggle k="orderConfirmEmail" label="Order Confirmation" desc="Send receipt email on purchase" />
                        <Toggle k="shippingUpdateEmail" label="Shipping Status Updates" desc="Notify when order is shipped" />
                        <Toggle k="reviewRequestEmail" label="Review Requests" desc="Ask for review 7 days after delivery" />
                        <Toggle k="abandonedCartEmail" label="Abandoned Cart Reminders" desc="Send reminder after 24h inactivity" />
                    </div>
                </div>

                {/* Admin Notifications */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ marginBottom: 20, color: '#FACC15', display: 'flex', alignItems: 'center', gap: 8 }}><FiShield /> Admin Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Toggle k="newOrderAlert" label="New Order Alerts" desc="Notify admins on new orders" />
                        <Toggle k="lowStockAlert" label="Low Stock Alerts" desc="Alert when book stock drops low" />
                        <Toggle k="newReviewAlert" label="New Review Alerts" desc="Notify when a review needs moderation" />
                    </div>

                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
                        <h4 style={{ color: '#EF4444', marginBottom: 12, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}><FiAlertTriangle /> Danger Zone</h4>
                        <Toggle k="maintenanceMode" label="Maintenance Mode" desc="Temporarily hide storefront from public" />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => showToast('Changes discarded')}>Discard Changes</button>
                <button className="btn btn-primary" onClick={save} style={{ minWidth: 140 }}>
                    {saved ? <><FiCheck /> Saved!</> : <><FiSave /> Save All Settings</>}
                </button>
            </div>
        </div>
    );
};

export default ManageSettings;
