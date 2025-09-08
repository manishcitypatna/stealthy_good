import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import NavigationBar from './NavigationBar';
import IntegrationsScroll from './IntegrationsScroll';

const Layout = ({ children }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <AnimatedBackground />
      <NavigationBar />
      <main style={{ 
        paddingTop: '70px', 
        position: 'relative', 
        zIndex: 1,
        width: '100%',
        maxWidth: '100vw'
      }}>
        {children}
        <IntegrationsScroll />
      </main>
    </div>
  );
};

export default Layout;
