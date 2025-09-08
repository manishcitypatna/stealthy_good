import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HeroSection from './components/layout/HeroSection';
import AppSelectionPanel from './components/modals/AppSelectionPanel';
import DynamicFormPanel from './components/modals/DynamicFormPanel';
import OAuthCallback from './components/pages/OAuthCallback';
import SuccessPage from './components/pages/SuccessPage';
import { apiService } from './services/api';

// Landing Page Component
const LandingPage = () => {
  const [showAppSelection, setShowAppSelection] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleConnectClick = () => {
    console.log('✅ Connect button handler triggered');
    setShowAppSelection(true);
  };

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setShowAppSelection(false);
    setShowForm(true);
  };

const handleFormSubmit = async (app, formData) => {
  console.log('🚀 Form submitted:', { app, formData });
  
  try {
    if (app.id === 'gmail' || app.id === 'outlook') {
      // OAuth flow
      const result = await apiService.connectApp(app.id, formData);
      if (result.success && result.authUrl) {
        console.log('🔗 Redirecting to OAuth provider...');
        window.location.href = result.authUrl;
      } else {
        console.error('❌ OAuth URL generation failed');
      }
    } else {
      // API key flow - REDIRECT TO SUCCESS PAGE (like Gmail does)
      const result = await apiService.saveCredentials(app.id, formData);
      if (result.success) {
        console.log('✅ Credentials saved successfully!');
        
        // REDIRECT TO SUCCESS PAGE instead of showing alert
        window.location.href = `/success?provider=${app.id}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&status=success`;
        
        // Close modals
        setShowForm(false);
        setSelectedApp(null);
      }
    }
  } catch (error) {
    console.error('❌ Connection failed:', error);
    // Redirect to error page instead of alert
    window.location.href = `/success?status=error&message=${encodeURIComponent(error.message)}`;
  }
};


  const closeAllModals = () => {
    setShowAppSelection(false);
    setShowForm(false);
    setSelectedApp(null);
  };

  return (
    <Layout>
      <HeroSection onConnectClick={handleConnectClick} />
      
      {showAppSelection && (
        <AppSelectionPanel 
          onClose={closeAllModals}
          onSelectApp={handleAppSelect}
        />
      )}
      
      {showForm && selectedApp && (
        <DynamicFormPanel
          selectedApp={selectedApp}
          onClose={closeAllModals}
          onSubmit={handleFormSubmit}
        />
      )}
    </Layout>
  );
};

// Main App with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/oauth2callback" element={<OAuthCallback />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
