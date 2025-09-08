const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory cache to prevent duplicate requests (in production, use Redis)
const processedRequests = new Set();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://stealthy-good.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      n8n: process.env.N8N_API_URL ? 'configured' : 'not configured',
      google: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'not configured',
      microsoft: process.env.MS_CLIENT_ID ? 'configured' : 'not configured'
    }
  });
});

// Environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const MS_CLIENT_ID = process.env.MS_CLIENT_ID;
const MS_CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
const MS_REDIRECT_URI = process.env.MS_REDIRECT_URI;

const N8N_API_URL = process.env.N8N_API_URL?.replace(/\/+$/, '');
const N8N_API_KEY = process.env.N8N_API_KEY;

// Helper functions
function encodeState(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function decodeState(str) {
  return JSON.parse(Buffer.from(str, 'base64url').toString());
}

// ENHANCED: Save to n8n with detailed error logging
async function saveToN8n(credentialData) {
  if (!N8N_API_URL || !N8N_API_KEY) {
    throw new Error('n8n API configuration missing');
  }

  console.log('🔄 n8n API Request Details:');
  console.log('📍 URL:', `${N8N_API_URL}/api/v1/credentials`);
  console.log('🔑 API Key:', N8N_API_KEY ? 'Present' : 'Missing');
  console.log('📦 Payload:', JSON.stringify(credentialData, null, 2));

  try {
    const response = await axios.post(`${N8N_API_URL}/api/v1/credentials`, credentialData, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ n8n API Success:', response.status);
    return response.data;

  } catch (error) {
    console.error('❌ n8n API Error Details:');
    
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('🔴 Status:', error.response.status);
      console.error('🔴 Status Text:', error.response.statusText);
      console.error('🔴 Response Headers:', error.response.headers);
      console.error('🔴 Response Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 400) {
        console.error('🔍 400 Error Analysis:');
        console.error('   - Check if credential type is correct');
        console.error('   - Verify n8n API key permissions');
        console.error('   - Confirm payload structure matches n8n requirements');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('🔴 Network Error - No Response Received');
      console.error('🔴 Request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('🔴 Request Setup Error:', error.message);
    }
    
    throw error;
  }
}

// OAuth Start Routes
app.post('/oauth/start/:provider', async (req, res) => {
  const { provider } = req.params;
  const { name, email } = req.body;

  console.log(`🚀 Starting ${provider} OAuth for:`, { name, email });

  try {
    if (provider === 'gmail') {
      if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({ 
          success: false, 
          message: 'Google OAuth not configured' 
        });
      }

      const state = encodeState({ provider, name, email, timestamp: Date.now() });
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${GOOGLE_REDIRECT_URI}&` +
        `scope=https://www.googleapis.com/auth/gmail.readonly&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${state}`;

      return res.json({ success: true, authUrl });
    }

    if (provider === 'outlook') {
      if (!MS_CLIENT_ID || !MS_CLIENT_SECRET) {
        return res.status(500).json({ 
          success: false, 
          message: 'Microsoft OAuth not configured' 
        });
      }

      const state = encodeState({ provider, name, email, timestamp: Date.now() });
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${MS_CLIENT_ID}&` +
        `redirect_uri=${MS_REDIRECT_URI}&` +
        `scope=offline_access Mail.Read&` +
        `response_type=code&` +
        `prompt=consent&` +
        `state=${state}`;

      return res.json({ success: true, authUrl });
    }

    res.status(400).json({ success: false, message: 'Invalid OAuth provider' });
  } catch (error) {
    console.error(`❌ ${provider} OAuth start error:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// OAuth Callback Route (Original - may not be used now)
app.get('/oauth2callback', async (req, res) => {
  console.log('🔄 STEP 1: OAuth callback route HIT');
  console.log('🔄 STEP 2: Received query params:', req.query);
  
  const { code, state, error } = req.query;
  
  console.log('🔄 STEP 3: Extracted values:', {
    code: code ? 'Present' : 'Missing',
    state: state ? 'Present' : 'Missing',
    error: error || 'None'
  });

  if (error) {
    console.error('❌ STEP 4: OAuth error received:', error);
    const errorUrl = `http://localhost:3000/success?status=error&message=${encodeURIComponent(error)}`;
    console.log('🔄 STEP 5: Redirecting to error page:', errorUrl);
    return res.redirect(errorUrl);
  }

  if (!code || !state) {
    console.error('❌ STEP 4: Missing code or state');
    const errorUrl = `http://localhost:3000/success?status=error&message=Missing authorization code`;
    console.log('🔄 STEP 5: Redirecting to error page:', errorUrl);
    return res.redirect(errorUrl);
  }

  try {
    console.log('🔄 STEP 4: Decoding state parameter');
    const stateData = decodeState(state);
    console.log('✅ STEP 5: Decoded state data:', stateData);
    
    const provider = stateData.provider;
    console.log(`🔄 STEP 6: Processing ${provider} callback`);
    
    let tokens = {};

    if (provider === 'gmail') {
      console.log('🔄 STEP 7: Starting Gmail token exchange with Google');
      
      const tokenRequest = {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI
      };
      
      console.log('🔄 STEP 8: Token request params:', {
        client_id: tokenRequest.client_id ? 'Present' : 'Missing',
        client_secret: tokenRequest.client_secret ? 'Present' : 'Missing',
        code: 'Present',
        redirect_uri: tokenRequest.redirect_uri
      });

      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', tokenRequest);
      
      console.log('✅ STEP 9: Received token response status:', tokenResponse.status);
      tokens = tokenResponse.data;
      console.log('✅ STEP 10: Token data received:', {
        access_token: tokens.access_token ? 'Present' : 'Missing',
        refresh_token: tokens.refresh_token ? 'Present' : 'Missing',
        scope: tokens.scope
      });

      console.log('🔄 STEP 11: Preparing n8n credential data');
      const credentialData = {
        name: `Gmail_${stateData.name}_${stateData.email}`,
        type: process.env.N8N_GMAIL_CRED_TYPE || 'gmailOAuth2',
        data: {
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          oauthTokenData: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type || 'Bearer',
            expires_in: tokens.expires_in
          },
          sendAdditionalBodyProperties: false,
          additionalBodyProperties: {}
        }
      };

      console.log('🔄 STEP 12: Saving credentials to n8n');
      const n8nResult = await saveToN8n(credentialData);
      console.log('✅ STEP 13: Credentials saved to n8n, ID:', n8nResult.id);
    }

    if (provider === 'outlook') {
      console.log('🔄 STEP 7: Starting Outlook token exchange with Microsoft');
      
      const tokenResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        client_id: MS_CLIENT_ID,
        client_secret: MS_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: MS_REDIRECT_URI
      });

      tokens = tokenResponse.data;
      console.log('✅ STEP 8: Outlook token received');

      const credentialData = {
        name: `Outlook_${stateData.name}_${stateData.email}`,
        type: process.env.N8N_OUTLOOK_CRED_TYPE || 'microsoftOutlookOAuth2Api',
        data: {
          clientId: MS_CLIENT_ID,
          clientSecret: MS_CLIENT_SECRET,
          oauthTokenData: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type || 'Bearer',
            expires_in: tokens.expires_in
          },
          sendAdditionalBodyProperties: false,
          additionalBodyProperties: {}
        }
      };

      await saveToN8n(credentialData);
      console.log('✅ STEP 9: Outlook credentials saved to n8n');
    }

    console.log('🔄 STEP 14: Building success redirect URL');
    const successUrl = `http://localhost:3000/success?` +
      `provider=${provider}&` +
      `name=${encodeURIComponent(stateData.name)}&` +
      `email=${encodeURIComponent(stateData.email)}&` +
      `status=success`;

    console.log('✅ STEP 15: SUCCESS! Redirecting to:', successUrl);
    res.redirect(successUrl);

  } catch (error) {
    console.error('❌ STEP ERROR: OAuth callback failed:', error.message);
    console.error('❌ Full error:', error);
    
    const errorUrl = `http://localhost:3000/success?` +
      `status=error&` +
      `message=${encodeURIComponent(error.message)}`;

    console.log('🔄 FINAL: Redirecting to error page:', errorUrl);
    res.redirect(errorUrl);
  }
});

// NEW: Process OAuth callback from frontend WITH DUPLICATE PREVENTION
app.post('/oauth/process-callback', async (req, res) => {
  const { code, state, provider, name, email, requestId } = req.body;
  
  // Prevent duplicate processing
  if (requestId && processedRequests.has(requestId)) {
    console.log('🔄 BACKEND: Duplicate request detected, skipping');
    console.log('🔄 BACKEND: Request ID already processed:', requestId);
    return res.json({
      success: true,
      message: `${provider} credentials already processed`,
      provider,
      userInfo: { name, email }
    });
  }

  console.log('🔄 BACKEND: Processing OAuth callback from frontend');
  console.log('🔄 BACKEND: Received data:', {
    code: code ? 'Present' : 'Missing',
    state: state ? 'Present' : 'Missing',
    provider,
    name,
    email,
    requestId
  });

  try {
    // Mark request as processed
    if (requestId) {
      processedRequests.add(requestId);
      console.log('🔄 BACKEND: Marked request as processed:', requestId);
    }

    let tokens = {};

    if (provider === 'gmail') {
      console.log('🔄 BACKEND: Starting Gmail token exchange');
      
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI
      });

      tokens = tokenResponse.data;
      console.log('✅ BACKEND: Gmail token received:', {
        access_token: tokens.access_token ? 'Present' : 'Missing',
        refresh_token: tokens.refresh_token ? 'Present' : 'Missing'
      });

      console.log('🔄 BACKEND: Saving Gmail credentials to n8n');
      const credentialData = {
        name: `Gmail_${name}_${email}`,
        type: process.env.N8N_GMAIL_CRED_TYPE || 'gmailOAuth2',
        data: {
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          oauthTokenData: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type || 'Bearer',
            expires_in: tokens.expires_in
          },
          sendAdditionalBodyProperties: false,
          additionalBodyProperties: {}
        }
      };

      const n8nResult = await saveToN8n(credentialData);
      console.log('✅ BACKEND: Gmail credentials saved to n8n, ID:', n8nResult.id);
    }

    if (provider === 'outlook') {
      console.log('🔄 BACKEND: Starting Outlook token exchange');
      
      const tokenResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        client_id: MS_CLIENT_ID,
        client_secret: MS_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: MS_REDIRECT_URI
      });

      tokens = tokenResponse.data;
      console.log('✅ BACKEND: Outlook token received');

      const credentialData = {
        name: `Outlook_${name}_${email}`,
        type: process.env.N8N_OUTLOOK_CRED_TYPE || 'microsoftOutlookOAuth2Api',
        data: {
          clientId: MS_CLIENT_ID,
          clientSecret: MS_CLIENT_SECRET,
          oauthTokenData: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type || 'Bearer',
            expires_in: tokens.expires_in
          },
          sendAdditionalBodyProperties: false,
          additionalBodyProperties: {}
        }
      };

      await saveToN8n(credentialData);
      console.log('✅ BACKEND: Outlook credentials saved to n8n');
    }

    console.log('✅ BACKEND: OAuth processing complete');
    res.json({
      success: true,
      message: `${provider} credentials saved successfully`,
      provider,
      userInfo: { name, email }
    });

  } catch (error) {
    // Remove from processed set on error
    if (requestId) {
      processedRequests.delete(requestId);
      console.log('🔄 BACKEND: Removed failed request from processed set:', requestId);
    }
    
    console.error('❌ BACKEND: OAuth processing error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API Key Routes (HubSpot, Streak) WITH MISSING PROPERTIES ADDED
app.post('/api/credentials/:provider', async (req, res) => {
  const { provider } = req.params;
  const { name, email, apiKey, token } = req.body;

  console.log(`🔑 Saving ${provider} credentials for:`, { name, email });

  try {
    let credentialData = {};

    if (provider === 'hubspot') {
      if (!apiKey) {
        return res.status(400).json({ success: false, message: 'HubSpot API key required' });
      }

      credentialData = {
        name: `HubSpot_${name}_${email}`,
        type: process.env.N8N_HUBSPOT_CRED_TYPE || 'hubspotAppToken',
        data: { 
          appToken: apiKey,
        }
      };
    }

    if (provider === 'streak') {
      if (!token) {
        return res.status(400).json({ success: false, message: 'Streak API token required' });
      }

      credentialData = {
        name: `Streak_${name}_${email}`,
        type: process.env.N8N_STREAK_CRED_TYPE || 'streakApi',
        data: { 
          apiKey: token,
        }
      };
    }

    if (!credentialData.name) {
      return res.status(400).json({ success: false, message: 'Invalid provider' });
    }

    const result = await saveToN8n(credentialData);

    res.json({
      success: true,
      message: `${provider} credentials saved successfully`,
      credentialId: result.id,
      provider,
      userInfo: { name, email }
    });

  } catch (error) {
    console.error(`❌ ${provider} credential save error:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🔗 Frontend will connect from http://localhost:3000`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 n8n integration: ${N8N_API_URL ? '✅ Configured' : '❌ Not configured'}`);
});
