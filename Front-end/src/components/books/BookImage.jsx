import { useState } from 'react';
import { getBookCover } from '../../utils/imageUtils';
import './BookImage.css';

export default function BookImage({ featuredImage, title }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // If the provided image errors out, ignore it and use our generated fallback
  const coverUrl = getBookCover(title, hasError ? null : featuredImage);

  return (
    <div className="book-image-container">
      <img
        src={coverUrl}
        alt={title || 'Book Cover'}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          if (!hasError && featuredImage && featuredImage.startsWith('http')) {
            setHasError(true);
          } else {
            // If the fallback also fails or there was no valid URL, stop the spinner
            setImageLoaded(true);
          }
        }}
        className={`modern-cover-img ${imageLoaded ? 'loaded' : 'loading'}`}
      />
      {!imageLoaded && (
        <div className="image-loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
