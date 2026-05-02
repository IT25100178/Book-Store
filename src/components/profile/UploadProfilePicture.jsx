import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function UploadProfilePicture() {
  const { user, updateUserProfile } = useAuth();
  const [preview, setPreview] = useState(user?.avatar || null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      setPreview(dataUrl);
      const result = await updateUserProfile({ avatar: dataUrl });
      setLoading(false);
      if (result?.success) {
        setSuccess('Profile picture updated!');
      } else {
        setError(result?.error || 'Failed to update picture.');
      }
    };
    reader.readAsDataURL(file);
  };

  const displayInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div>
      <h2 className="profile-section-title">Profile Picture</h2>
      {success && <div className="profile-success-msg">{success}</div>}
      {error && <div className="profile-error-msg">{error}</div>}

      <div className="avatar-upload-area">
        <div className="avatar-preview-large">
          {preview ? (
            <img src={preview} alt="Profile" />
          ) : (
            <img
              src={`https://ui-avatars.com/api/?background=D4AF37&color=fff&name=${encodeURIComponent(user?.name || 'U')}`}
              alt="Profile"
            />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <button
          className="profile-btn-primary"
          type="button"
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
        >
          {loading ? 'Uploading...' : '🖼️ Choose Photo'}
        </button>

        <p className="avatar-upload-hint">
          Supported formats: JPG, PNG, GIF, WebP<br />
          Recommended size: at least 200×200 px
        </p>
      </div>
    </div>
  );
}
