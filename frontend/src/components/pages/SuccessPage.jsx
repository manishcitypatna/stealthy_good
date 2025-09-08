import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const provider = urlParams.get('provider');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const status = urlParams.get('status') || 'success';
    const message = urlParams.get('message');

    console.log('✅ Success page data:', { provider, name, email, status, message });

    setPageData({ provider, name, email, status, message });

    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [location.search, navigate]);

  const getStatusMessage = () => {
    if (!pageData) return 'Loading...';
    
    if (pageData.status === 'error') {
      return pageData.message || 'An error occurred while processing your request.';
    }

    if (pageData.provider && pageData.name) {
      return `${pageData.name}, your ${getDisplayName(pageData.provider)} account has been successfully connected to n8n automation platform. You can now create powerful automated workflows using your connected account.`;
    }

    return 'Your account has been successfully connected to our automation platform.';
  };

  const getDisplayName = (provider) => {
    const names = {
      gmail: 'Gmail',
      hubspot: 'HubSpot', 
      outlook: 'Outlook',
      streak: 'Streak'
    };
    return names[provider] || provider;
  };

  if (!pageData) {
    return (
      <Layout>
        <div style={{ 
          minHeight: '80vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div className="modal-panel" style={{ position: 'relative', margin: 0 }}>
          <div className="modal-content">
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '40px'
              }}>
                {pageData.status === 'error' ? '❌' : '✅'}
              </div>
              
              <h1 style={{ 
                color: 'white', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                {pageData.status === 'error' ? 'Connection Failed' : 'Successfully Connected!'}
              </h1>
              
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1rem', 
                lineHeight: '1.5', 
                textAlign: 'center',
                marginBottom: '30px'
              }}>
                {getStatusMessage()}
              </p>
            </div>

            <button 
              onClick={() => navigate('/')}
              style={{
                width: '200px',
                height: '44px',
                background: 'linear-gradient(135deg, #e91e63, #c2185b)',
                color: 'white',
                border: 'none',
                borderRadius: '22px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                margin: '0 auto',
                display: 'block'
              }}
            >
              Back to Home
            </button>

            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.8rem', 
              textAlign: 'center', 
              marginTop: '20px' 
            }}>
              Redirecting automatically in 10 seconds...
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;
