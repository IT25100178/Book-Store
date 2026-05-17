// UploadProfilePicture.jsx – Member 6 (Vishok)
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function UploadProfilePicture() {
  const { user, updateUserProfile } = useAuth();
  const fileRef = useRef();
  const [preview, setPreview] = useState(user?.avatar || null);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 2 * 1024 * 1024)     { setError('File must be under 2 MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!preview) { setError('Please choose an image first.'); return; }
    setLoading(true);
    const result = await updateUserProfile({ avatar: preview });
    setLoading(false);
    if (result?.success) setSuccess('Profile picture updated!');
    else setError(result?.error || 'Failed to update picture.');
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  return (
    <div>
      <h2 className="profile-section-title">Profile Picture</h2>
      {success && <div className="profile-success-msg">{success}</div>}
      {error   && <div className="profile-error-msg">{error}</div>}

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem', marginTop:'1rem' }}>
        <div style={{
          width:120, height:120, borderRadius:'50%',
          background:'linear-gradient(135deg,#8B0000,#D4AF37)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'3rem', fontWeight:700, overflow:'hidden',
          border:'3px solid rgba(212,175,55,0.4)',
        }}>
          {preview
            ? <img src={preview} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : (user?.name?.charAt(0)?.toUpperCase() || 'U')}
        </div>

        <input type="file" accept="image/*" ref={fileRef} style={{ display:'none' }} onChange={handleFileChange} />
        <button className="profile-btn-outline" onClick={() => fileRef.current?.click()}>
          📁 Choose Image
        </button>
        <button className="profile-btn-primary" onClick={handleSave} disabled={loading || !preview}>
          {loading ? 'Saving...' : '💾 Save Picture'}
        </button>
      </div>
    </div>
  );
}
