// SavedAddress.jsx – Member 6 (Vishok)
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SavedAddress() {
  const { user } = useAuth();
  const [address, setAddress] = useState({
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || '',
    city:  user?.address?.city  || '',
    zip:   user?.address?.zip   || '',
  });
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`address_${user?.id}`, JSON.stringify(address));
    setSuccess('Address saved!');
    setTimeout(() => setSuccess(''), 2500);
  };

  return (
    <div>
      <h2 className="profile-section-title">Saved Address</h2>
      {success && <div className="profile-success-msg">{success}</div>}
      <form onSubmit={handleSubmit}>
        <label className="profile-label">Address Line 1</label>
        <input className="profile-input" type="text" placeholder="Street / Lane"
          value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
        <label className="profile-label">Address Line 2 (optional)</label>
        <input className="profile-input" type="text" placeholder="Apartment, Suite…"
          value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
        <label className="profile-label">City</label>
        <input className="profile-input" type="text" placeholder="City"
          value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
        <label className="profile-label">Postal Code</label>
        <input className="profile-input" type="text" placeholder="00000"
          value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
        <button className="profile-btn-primary" type="submit">Save Address</button>
      </form>
    </div>
  );
}
