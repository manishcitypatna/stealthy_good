import { getConfig, isDevelopment } from '../config/config.js';

const config = getConfig();
const API_BASE = config.BACKEND_URL;

export const apiService = {
  async connectApp(provider, userData) {
    if (isDevelopment()) {
      console.log(`🔗 Connecting to ${provider}:`, userData);
    }
    
    try {
      const response = await fetch(`${API_BASE}/oauth/start/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        signal: AbortSignal.timeout(config.API_TIMEOUT)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`❌ ${provider} connection error:`, error);
      throw error;
    }
  },

  async saveCredentials(provider, credentialData) {
    if (isDevelopment()) {
      console.log(`💾 Saving ${provider} credentials:`, credentialData);
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/credentials/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentialData),
        signal: AbortSignal.timeout(config.API_TIMEOUT)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`❌ ${provider} credential save error:`, error);
      throw error;
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        signal: AbortSignal.timeout(config.API_TIMEOUT)
      });
      return await response.json();
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  },

  getInfo() {
    return {
      environment: config,
      apiBase: API_BASE,
      isDev: isDevelopment()
    };
  }
};
