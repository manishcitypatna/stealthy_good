import React from 'react';

const HeroSection = ({ onConnectClick }) => {
  const handleCTAClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 CTA Button clicked!');
    
    if (onConnectClick) {
      onConnectClick();
    } else {
      console.error('❌ onConnectClick prop is missing!');
    }
  };

  return (
    <section 
      className="hero-section"
      style={{ 
        position: 'relative', 
        zIndex: 2, 
        pointerEvents: 'auto',
        userSelect: 'text'
      }}
    >
      <h1 className="main-header">CONNECT ONCE. AUTOMATE THE REST</h1>
      <h2 className="tagline">Securely connect your tools to Stealthy Good.</h2>
      
      <p className="description">
        We use OAuth and the least-privilege permissions required to power your automations. 
        No passwords are stored, and we never train AI models on your data. 
        Revoke access anytime from your provider.
      </p>
      
      <h3 className="feature-title">Automate with Confidence</h3>
      
      <div className="features-list">
        <span>Least-privilege access</span>
        <span>12+ integrations</span>
        <span>2M+ tasks run</span>
      </div>
      
      <button 
        className="cta-button"
        onClick={handleCTAClick}
        type="button"
        style={{ 
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
      >
        Start Connecting
      </button>
    </section>
  );
};

export default HeroSection;
