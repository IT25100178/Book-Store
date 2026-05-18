import { useState } from 'react';
import { getBookCover } from '../../utils/imageUtils';
import './BookImage.css';

export default function BookImage({ featuredImage, title }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const coverUrl = getBookCover(title, featuredImage);

  return (
    <div className="book-image-container">
      <img
        src={coverUrl}
        alt={title || 'Book Cover'}
        onLoad={() => setImageLoaded(true)}
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
