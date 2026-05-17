// src/components/books/BookImage.jsx
// Member 2 – Deepika — fixed import path
import { useState } from 'react';
import './BookImage.css';

export default function BookImage({ image, featuredImage, title }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="book-image-container">
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
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageError(true); setShowFeatured(false); }}
              className={imageLoaded ? 'loaded' : 'loading'}
            />
          </div>
          <div
            className={`emoji-icon ${showFeatured ? 'hidden' : ''}`}
            onMouseEnter={() => setShowFeatured(true)}
          >
            {image}
          </div>
        </>
      )}
      {(!featuredImage || imageError) && (
        <div className="emoji-icon-only">{image}</div>
      )}
      {!imageLoaded && featuredImage && !imageError && (
        <div className="image-loading"><div className="spinner"></div></div>
      )}
    </div>
  );
}
