// src/components/BookImage.jsx
import { useState } from 'react';
import './BookImage.css';

export default function BookImage({ image, featuredImage, title }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setShowFeatured(false);
  };

  return (
    <div className="book-image-container">
      {/* Featured Image (hover) */}
      {featuredImage && !imageError && (
        <>
          <div
            className={`featured-image ${showFeatured ? 'active' : ''}`}
            onMouseEnter={() => setShowFeatured(true)}
            onMouseLeave={() => setShowFeatured(false)}
          >
            <img
              src={featuredImage}
              alt={title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={imageLoaded ? 'loaded' : 'loading'}
            />
          </div>

          {/* Emoji Icon Fallback */}
          <div
            className={`emoji-icon ${showFeatured ? 'hidden' : ''}`}
            onMouseEnter={() => setShowFeatured(true)}
          >
            {image}
          </div>
        </>
      )}

      {/* Fallback to Emoji Only */}
      {(!featuredImage || imageError) && (
        <div className="emoji-icon-only">{image}</div>
      )}

      {/* Loading Spinner */}
      {!imageLoaded && featuredImage && !imageError && (
        <div className="image-loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
