import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function EditProfile() {
  const { user, updateUserProfile } = useAuth();
  const [name,        setName]        = useState(user?.name        || '');
  const [email,       setEmail]       = useState(user?.email       || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [success,     setSuccess]     = useState('');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    if (!name.trim() || !email.trim()) { setError('All fields are required.'); return; }
    if (name.trim().length < 2)        { setError('Name must be at least 2 characters.'); return; }
    if (!email.includes('@'))          { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    const result = await updateUserProfile({ name: name.trim(), email: email.trim(), phoneNumber: phoneNumber.trim() });
    setLoading(false);
    if (result?.success) setSuccess('Profile updated successfully!');
    else setError(result?.error || 'Failed to update profile.');
  };

  return (
    <div>
      <h2 className="profile-section-title">Edit Profile</h2>
      {success && <div className="profile-success-msg">{success}</div>}
      {error   && <div className="profile-error-msg">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="profile-label">Full Name</label>
        <input className="profile-input" type="text"  placeholder="Your full name"   value={name}        onChange={(e) => setName(e.target.value)} />
        <label className="profile-label">Email Address</label>
        <input className="profile-input" type="email" placeholder="your@email.com"   value={email}       onChange={(e) => setEmail(e.target.value)} />
        <label className="profile-label">Phone Number (optional)</label>
        <input className="profile-input" type="tel"   placeholder="+94 77 000 0000"  value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button className="profile-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
