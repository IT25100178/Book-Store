import React from 'react';
import { useLocation } from 'react-router-dom';
import './PageLoader.css';

function LoaderContent() {
  return (
    <div className="page-loader-overlay">
      <div className="ripple-loader-container">
        {[...Array(7)].map((_, index) => (
          <div key={index} className="ripple-bar"></div>
        ))}
      </div>
    </div>
  );
}

export default function PageLoader() {
  const location = useLocation();
  // By using the pathname as the key, React will unmount and remount 
  // the LoaderContent on every route change, perfectly triggering the CSS fade-out animation.
  return <LoaderContent key={location.pathname} />;
}
