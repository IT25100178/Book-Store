import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const Check = ({ size=24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const ImagePlus = ({ size=24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="2"/><line x1="19" y1="3" x2="19" y2="9"/><line x1="16" y1="6" x2="22" y2="6"/></svg>;
const X = ({ size=24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function EditProfile() {
  const { user, updateUserProfile } = useAuth();
  
  // Data State
  const [firstName,   setFirstName]   = useState(user?.name?.split(' ')[0] || '');
  const [lastName,    setLastName]    = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [username,    setUsername]    = useState(user?.email?.split('@')[0] || '');
  const [website,     setWebsite]     = useState('');
  const [bio,         setBio]         = useState('Avid reader and collector of rare, first-edition books.');
  
  const [success,     setSuccess]     = useState('');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  const maxLength = 180;
  const characterCount = bio.length;

  // Cover Photo State (Default Unsplash luxury library)
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80');
  const coverInputRef = useRef(null);

  // Avatar State (Default Unsplash user)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80');
  const avatarInputRef = useRef(null);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setCoverUrl(URL.createObjectURL(file));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !username) { setError('Name and Username are required.'); return; }

    setLoading(true);
    // Passing the original email and phone since this form focuses on profile data
    const result = await updateUserProfile({ 
       name: fullName, 
       email: user?.email, 
       phoneNumber: user?.phoneNumber 
    });
    setLoading(false);
    
    if (result?.success) setSuccess('Profile updated successfully!');
    else setError(result?.error || 'Failed to update profile.');
  };

  return (
    <div className="edit-profile-wrapper">
      
      {/* ── Cover Background ── */}
      <div className="profile-cover-area">
        {coverUrl && <img className="profile-cover-img" src={coverUrl} alt="Cover" />}
        <div className="profile-cover-actions">
          <button type="button" className="action-btn" onClick={() => coverInputRef.current?.click()} aria-label="Upload cover">
            <ImagePlus size={18} />
          </button>
          {coverUrl && (
            <button type="button" className="action-btn" onClick={() => setCoverUrl('')} aria-label="Remove cover">
              <X size={18} />
            </button>
          )}
        </div>
        <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" style={{ display: 'none' }} />
      </div>

      {/* ── Overlapping Avatar ── */}
      <div className="profile-avatar-area">
        <div className="profile-avatar-frame">
          <img src={avatarUrl} alt="Profile" className="profile-avatar-img" />
          <button type="button" className="action-btn" onClick={() => avatarInputRef.current?.click()}>
            <ImagePlus size={16} />
          </button>
          <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
        </div>
      </div>

      {/* ── Form Section ── */}
      <div className="edit-profile-form-area">
        <h2 className="profile-section-title" style={{ marginTop: '10px', marginBottom: '24px', paddingBottom: 0, border: 'none', fontSize: '1.25rem' }}>
          Edit Profile
        </h2>

        {success && <div className="profile-success-msg">{success}</div>}
        {error   && <div className="profile-error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <label className="profile-label">First name</label>
              <input className="profile-input" type="text" placeholder="Matt" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="form-col">
              <label className="profile-label">Last name</label>
              <input className="profile-input" type="text" placeholder="Welsh" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <label className="profile-label">Username</label>
          <div className="input-with-icon">
            <input className="profile-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <div className="input-icon-adornment">
              <Check size={18} />
            </div>
          </div>

          <label className="profile-label">Website</label>
          <div className="input-group-prepend">
            <span className="prepend-text">https://</span>
            <input className="profile-input" type="text" placeholder="yourwebsite.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          <label className="profile-label">Biography</label>
          <textarea 
            className="profile-textarea" 
            placeholder="Write a few sentences about yourself" 
            value={bio} 
            maxLength={maxLength}
            onChange={(e) => setBio(e.target.value)} 
          />
          <div className="char-count">
            <span style={{ fontFamily: 'monospace' }}>{maxLength - characterCount}</span> characters left
          </div>

          <div className="form-footer">
             <button type="button" className="profile-btn-outline" onClick={() => {}}>Cancel</button>
             <button type="submit" className="profile-btn-primary" disabled={loading}>
               {loading ? 'Saving...' : 'Save changes'}
             </button>
          </div>
        </form>
      </div>

    </div>
  );
}
