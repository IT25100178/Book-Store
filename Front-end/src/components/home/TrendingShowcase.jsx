import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TrendingShowcase.css';

const TRENDING_BOOKS = {
  left: {
    id: 'left',
    label: 'First Edition',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A beautifully preserved first edition capturing the decadence of the Jazz Age. The quintessential American novel of the 1920s.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=500',
    stats: { status: 'In Stock', rating: 4.9 },
    features: [
      { label: 'Condition', value: 98 },
      { label: 'Rarity', value: 92 },
    ]
  },
  right: {
    id: 'right',
    label: 'Leather Bound',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'A pristine, hand-bound volume of Stoic philosophy. Notes on life, leadership, and resilience written by the Roman Emperor himself.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=500',
    stats: { status: 'Only 2 Left', rating: 4.8 },
    features: [
      { label: 'Condition', value: 95 },
      { label: 'Demand', value: 89 },
    ]
  }
};

export default function TrendingShowcase() {
  const [activeSide, setActiveSide] = useState('left');
  const currentData = TRENDING_BOOKS[activeSide];
  const isLeft = activeSide === 'left';

  return (
    <section className="trending-showcase-section">
      <div className={`showcase-bg ${activeSide}`}></div>
      
      <div className="section-header center-header" style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
        <h2 className="section-title">Trending Masterpieces</h2>
        <p className="section-subtitle">Exquisite volumes capturing the world's attention.</p>
      </div>

      <div className={`showcase-container ${isLeft ? 'layout-left' : 'layout-right'}`}>
        
        {/* Visual Column */}
        <div className="showcase-visual">
          <div className="animated-ring ring-1"></div>
          <div className="animated-ring ring-2"></div>
          <div className="visual-image-wrapper">
             <img key={currentData.id} src={currentData.image} alt={currentData.title} className="floating-book fade-in-image" />
          </div>
          <div className="status-badge">
             <span className="pulse-dot"></span>
             {currentData.stats.status}
          </div>
        </div>

        {/* Content Column */}
        <div className="showcase-content">
          <h3 className="showcase-label">{currentData.label}</h3>
          <h1 className="showcase-title">{currentData.title}</h1>
          <p className="showcase-author">By {currentData.author}</p>
          <p className="showcase-description">{currentData.description}</p>
          
          <div className="showcase-features-grid">
            {currentData.features.map(f => (
               <div key={f.label} className="feature-item">
                  <div className="feature-header">
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        {f.label}
                     </span>
                     <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>{f.value}%</span>
                  </div>
                  <div className="feature-bar-bg">
                     <div className="feature-bar-fill" style={{ width: `${f.value}%` }}></div>
                  </div>
               </div>
            ))}
          </div>

          <Link to="/books" className="view-details-btn">
             View Collection <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      {/* Pill Switcher */}
      <div className="switcher-track">
        {Object.values(TRENDING_BOOKS).map(opt => (
            <button 
              key={opt.id}
              className={`switcher-btn ${activeSide === opt.id ? 'active' : ''}`}
              onClick={() => setActiveSide(opt.id)}
            >
              {opt.title}
            </button>
        ))}
        <div className={`switcher-indicator ${activeSide}`}></div>
      </div>
    </section>
  );
}
