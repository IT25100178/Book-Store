import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const EMPTY_FORM = { fullName: '', street: '', city: '', postalCode: '', country: '' };

export default function SavedAddress() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    const saved = localStorage.getItem('address_' + user.id);
    if (saved) {
      try { setFormData(JSON.parse(saved)); } catch (_) {}
    } else {
      setFormData({
        fullName: user.name || '',
        street: '42 Galle Road',
        city: 'Colombo',
        postalCode: '00300',
        country: 'Sri Lanka',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!formData.fullName || !formData.street || !formData.city) {
      setError('Full name, street, and city are required.');
      return;
    }
    localStorage.setItem('address_' + user.id, JSON.stringify(formData));
    setSuccess('Address saved successfully!');
  };

  return (
    <div>
      <h2 className="profile-section-title">Saved Address</h2>
      {success && <div className="profile-success-msg">{success}</div>}
      {error && <div className="profile-error-msg">{error}</div>}
      <form onSubmit={handleSave}>
        <label className="profile-label">Full Name</label>
        <input className="profile-input" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />

        <label className="profile-label">Street Address</label>
        <input className="profile-input" name="street" placeholder="123 Main Street" value={formData.street} onChange={handleChange} />

        <div className="profile-form-row">
          <div>
            <label className="profile-label">City</label>
            <input className="profile-input" name="city" placeholder="Colombo" value={formData.city} onChange={handleChange} />
          </div>
          <div>
            <label className="profile-label">Postal Code</label>
            <input className="profile-input" name="postalCode" placeholder="00100" value={formData.postalCode} onChange={handleChange} />
          </div>
        </div>

        <label className="profile-label">Country</label>
        <input className="profile-input" name="country" placeholder="Sri Lanka" value={formData.country} onChange={handleChange} />

        <button className="profile-btn-primary" type="submit">Save Address</button>
      </form>
    </div>
  );
}
