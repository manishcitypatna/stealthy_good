// config.js - Single Configuration for All Environments
export const CONFIG = {
  // 👈 ONLY CHANGE THIS LINE FOR DEPLOYMENT
  ENVIRONMENT: 'local', // 'local' | 'production'
  
  // Local Development Configuration
  local: {
    FRONTEND_URL: 'http://localhost:3000',
    BACKEND_URL: 'http://localhost:5000',
    N8N_API_URL: 'https://n8n-latest-n8n.07cmzp.easypanel.host',
    
    // OAuth Redirect URIs
    GOOGLE_REDIRECT_URI: 'http://localhost:5000/oauth2callback',
    MS_REDIRECT_URI: 'http://localhost:5000/oauth2callback',
    
    // Development settings
    DEBUG_MODE: true,
    API_TIMEOUT: 5000
  },
  
  // Production Configuration  
  production: {
    FRONTEND_URL: 'https://stealthy-good.vercel.app',
    BACKEND_URL: 'https://stealthy-good-api.railway.app',
    N8N_API_URL: 'https://n8n-latest-n8n.07cmzp.easypanel.host',
    
    // OAuth Redirect URIs
    GOOGLE_REDIRECT_URI: 'https://stealthy-good.vercel.app/callback/google',
    MS_REDIRECT_URI: 'https://stealthy-good.vercel.app/callback/microsoft',
    
    // Production settings
    DEBUG_MODE: false,
    API_TIMEOUT: 10000
  }
};

// Helper function to get current environment config
export const getConfig = () => {
  const config = CONFIG[CONFIG.ENVIRONMENT];
  if (!config) {
    throw new Error(`Invalid environment: ${CONFIG.ENVIRONMENT}`);
  }
  return config;
};

// Helper function to check if in development
export const isDevelopment = () => CONFIG.ENVIRONMENT === 'local';

// Helper function to check if in production
export const isProduction = () => CONFIG.ENVIRONMENT === 'production';
