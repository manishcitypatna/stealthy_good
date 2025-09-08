import React from 'react';

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <div className="logo-image" style={{ 
          color: 'white', 
          fontWeight: 'bold', 
          fontSize: '1.5rem' 
        }}>
          Stealthy Good
        </div>
      </div>
      
      <div className="nav-center">
        <a href="#" className="nav-link">Home</a>
        <a href="#" className="nav-link">Work</a>
        <a href="#" className="nav-link">Blog</a>
        <a href="#" className="nav-link">About</a>
        <a href="#" className="nav-link">Pricing</a>
      </div>
      
      <div className="nav-contact">
        <a href="#" className="contact-button">Contact</a>
      </div>
    </nav>
  );
};

export default NavigationBar;
