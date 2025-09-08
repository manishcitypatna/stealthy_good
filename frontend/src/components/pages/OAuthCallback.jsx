import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple executions
      if (window.callbackProcessed) {
        console.log('🔄 FRONTEND: Callback already processed, skipping');
        return;
      }
      window.callbackProcessed = true;

      try {
        console.log('🔄 FRONTEND: OAuth callback received');
        
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        console.log('🔄 FRONTEND: Extracted params:', {
          code: code ? 'Present' : 'Missing',
          state: state ? 'Present' : 'Missing', 
          error: error || 'None'
        });

        if (error) {
          console.error('❌ FRONTEND: OAuth error:', error);
          window.location.replace(`/success?status=error&message=${error}`);
          return;
        }

        if (!code || !state) {
          console.error('❌ FRONTEND: Missing code or state');
          window.location.replace('/success?status=error&message=Missing authorization code');
          return;
        }

        // Decode state to get provider info
        let stateData = {};
        try {
          stateData = JSON.parse(atob(state));
          console.log('🔄 FRONTEND: Decoded state:', stateData);
        } catch (e) {
          console.error('❌ FRONTEND: Failed to decode state:', e);
          window.location.replace('/success?status=error&message=Invalid state parameter');
          return;
        }

        console.log('🔄 FRONTEND: Sending OAuth data to backend');
        
        // Generate unique request ID to prevent duplicates
        const requestId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        console.log('🔄 FRONTEND: Generated request ID:', requestId);
        
        // Send the OAuth data to backend for processing
        const response = await fetch('http://localhost:5000/oauth/process-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            provider: stateData.provider,
            name: stateData.name,
            email: stateData.email,
            requestId // Add unique ID to prevent duplicates
          })
        });

        console.log('🔄 FRONTEND: Backend response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('✅ FRONTEND: Backend processing successful:', result);
          
          // Redirect to success page
          window.location.replace(`/success?provider=${stateData.provider}&name=${encodeURIComponent(stateData.name)}&email=${encodeURIComponent(stateData.email)}&status=success`);
        } else {
          const errorResult = await response.json();
          console.error('❌ FRONTEND: Backend processing failed:', errorResult);
          window.location.replace(`/success?status=error&message=${encodeURIComponent(errorResult.message || 'Backend processing failed')}`);
        }

      } catch (error) {
        console.error('❌ FRONTEND: Callback processing error:', error);
        window.location.replace('/success?status=error&message=Callback processing failed');
      }
    };

    handleCallback();
  }, [location]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0e0e 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '3px solid #e91e63', 
          borderTop: '3px solid transparent', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2>Processing your connection...</h2>
        <p>Please wait while we securely connect your account.</p>
      </div>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
};

export default OAuthCallback;
