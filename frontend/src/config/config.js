// frontend/src/config/config.js
export const CONFIG = {
  ENVIRONMENT: 'local', // change to 'production' when deploying
  
  local: {
    FRONTEND_URL: 'http://localhost:3000',
    BACKEND_URL: 'http://localhost:5000',
    N8N_API_URL: 'https://n8n.srv811166.hstgr.cloud',
    GOOGLE_REDIRECT_URI: 'http://localhost:3000/callback/google',
    MS_REDIRECT_URI: 'http://localhost:3000/callback/microsoft',
    DEBUG_MODE: true,
    API_TIMEOUT: 5000
  },
  
  production: {
    FRONTEND_URL: 'https://stealthy-good.vercel.app',
    BACKEND_URL: 'https://stealthy-good-api.railway.app',
    N8N_API_URL: 'https://n8n.srv811166.hstgr.cloud',
    GOOGLE_REDIRECT_URI: 'https://stealthy-good.vercel.app/callback/google',
    MS_REDIRECT_URI: 'https://stealthy-good.vercel.app/callback/microsoft',
    DEBUG_MODE: false,
    API_TIMEOUT: 10000
  }
};

export const getConfig = () => {
  const config = CONFIG[CONFIG.ENVIRONMENT];
  if (!config) {
    throw new Error(`Invalid environment: ${CONFIG.ENVIRONMENT}`);
  }
  return config;
};

export const isDevelopment = () => CONFIG.ENVIRONMENT === 'local';
export const isProduction = () => CONFIG.ENVIRONMENT === 'production';
