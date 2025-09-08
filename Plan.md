Stealthy Good Simplified - Phase by Phase Build Plan 🚀
📋 Project Overview
Objective: Build simplified OAuth integration platform with beautiful UI
Architecture: Minimal React frontend (serverless) + Single-file Node.js backend
Timeline: 10 days (2 phases per day)

🏗️ Phase 1: Project Foundation & Backend Setup
Day 1-2 | Duration: 8-10 hours

Phase 1.1: Project Structure Creation ⏱️ 2 hours
Task 1.1.1: Initialize Project Directory
bash
mkdir stealthy-good-simplified
cd stealthy-good-simplified

# Create directory structure
mkdir -p backend
mkdir -p frontend/src
mkdir -p frontend/public
mkdir -p docs
Task 1.1.2: Backend Package Setup
bash
cd backend

# Initialize package.json
npm init -y

# Install dependencies (exact multi-auth pattern)
npm install express cors axios dotenv

# Install dev dependencies
npm install --save-dev nodemon
📋 Deliverable: Clean project structure with backend dependencies installed

Phase 1.2: Backend Implementation ⏱️ 6-8 hours
Task 1.2.1: Create Single Backend File
javascript
// backend/index.js (Complete OAuth server in one file)

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
    environment: process.env.NODE_ENV || 'development'
  });
});

// OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const MS_CLIENT_ID = process.env.MS_CLIENT_ID;
const MS_CLIENT_SECRET = process.env.MS_CLIENT_SECRET;  
const MS_REDIRECT_URI = process.env.MS_REDIRECT_URI;

const N8N_API_URL = process.env.N8N_API_URL?.replace(/\/+$/, '');
const N8N_API_KEY = process.env.N8N_API_KEY;

// OAuth Start Routes
app.post('/oauth/start/:provider', async (req, res) => {
  const { provider } = req.params;
  const { name, email } = req.body;

  try {
    if (provider === 'gmail') {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${GOOGLE_REDIRECT_URI}&` +
        `scope=https://www.googleapis.com/auth/gmail.readonly&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${Buffer.from(JSON.stringify({ provider, name, email })).toString('base64')}`;
      
      return res.json({ success: true, authUrl });
    }

    if (provider === 'outlook') {
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${MS_CLIENT_ID}&` +
        `redirect_uri=${MS_REDIRECT_URI}&` +
        `scope=offline_access Mail.Read&` +
        `response_type=code&` +
        `prompt=consent&` +
        `state=${Buffer.from(JSON.stringify({ provider, name, email })).toString('base64')}`;
        
      return res.json({ success: true, authUrl });
    }

    res.status(400).json({ success: false, message: 'Invalid provider' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// OAuth Callback Routes  
app.get('/oauth/callback/:provider', async (req, res) => {
  // OAuth callback processing logic
  // Token exchange and n8n credential saving
});

// API Key Routes (HubSpot, Streak)
app.post('/api/credentials/:provider', async (req, res) => {
  // API key processing and n8n integration
});

// n8n Integration Helper Functions
async function saveToN8n(credentialData) {
  // n8n credential creation logic
}

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🔗 Frontend will connect from http://localhost:3000`);
});
Task 1.2.2: Environment Configuration
bash
# backend/.env
PORT=5000
NODE_ENV=development

# n8n Configuration
N8N_API_URL=https://n8n.srv811166.hstgr.cloud
N8N_API_KEY=your_n8n_api_key_here

# Google OAuth (Gmail)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret  
GOOGLE_REDIRECT_URI=http://localhost:3000/callback/google

# Microsoft OAuth (Outlook)
MS_CLIENT_ID=your_microsoft_client_id
MS_CLIENT_SECRET=your_microsoft_client_secret
MS_REDIRECT_URI=http://localhost:3000/callback/microsoft

# Credential Types for n8n
N8N_GMAIL_CRED_TYPE=gmailOAuth2
N8N_OUTLOOK_CRED_TYPE=microsoftOutlookOAuth2Api
N8N_HUBSPOT_CRED_TYPE=hubspotAppToken
N8N_STREAK_CRED_TYPE=streakApi
Task 1.2.3: Update Package.json Scripts
json
// backend/package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
📋 Deliverable: Complete backend with OAuth + n8n integration

🎨 Phase 2: Frontend Foundation
Day 3-4 | Duration: 8-10 hours

Phase 2.1: React Setup ⏱️ 2-3 hours
Task 2.1.1: Initialize Vite React Project
bash
cd frontend
npm create vite@latest . -- --template react

# Install minimal dependencies
npm install react-router-dom axios
Task 2.1.2: Configure Vite
javascript
// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true
  }
})
Task 2.1.3: Update Package.json
json
// frontend/package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
📋 Deliverable: React development environment ready

Phase 2.2: Core CSS & Design System ⏱️ 5-7 hours
Task 2.2.1: Create Design System
css
/* frontend/src/styles/variables.css */
:root {
  /* Primary Colors */
  --primary-pink: #e91e63;
  --primary-pink-dark: #c2185b;
  --primary-pink-light: #f48fb1;
  
  /* Neutrals */
  --white: #ffffff;
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-600: #757575;
  --gray-900: #212121;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Border Radius */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Transitions */
  --transition-normal: 300ms ease-in-out;
}
Task 2.2.2: Animated Background CSS
css
/* frontend/src/styles/animations.css */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f0e0e 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  z-index: -1;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(221, 122, 253, 0.8) 0%, rgba(221, 122, 253, 0.2) 70%);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(104, 27, 247, 0.6) 0%, rgba(104, 27, 247, 0.1) 70%);
  top: 60%;
  right: 15%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  33% { transform: translateY(-30px) translateX(20px) rotate(5deg); }
  66% { transform: translateY(20px) translateX(-15px) rotate(-3deg); }
}
Task 2.2.3: Modal System CSS
css
/* frontend/src/styles/modals.css */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-panel {
  width: 400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
  padding: 40px 30px;
  background: linear-gradient(135deg, #4b0082 0%, #dd7afd 25%, #6500ea 50%, #8b5cf6 75%, #dd7afd 100%);
  background-size: 200% 200%;
  animation: gradientShift 12s ease-in-out infinite;
  border: none;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
📋 Deliverable: Complete CSS design system with animations

⚙️ Phase 3: Core Components
Day 5-6 | Duration: 8-10 hours

Phase 3.1: Layout Components ⏱️ 4-5 hours
Task 3.1.1: Animated Background Component
javascript
// frontend/src/components/AnimatedBackground.jsx
import React from 'react';

const AnimatedBackground = ({ children }) => {
  return (
    <div className="animated-background">
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
      {children}
    </div>
  );
};

export default AnimatedBackground;
Task 3.1.2: Navigation Bar Component
javascript
// frontend/src/components/NavigationBar.jsx
import React from 'react';

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <img src="/logo.png" alt="Stealthy Good" className="logo-image" />
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
📋 Deliverable: Core layout components with animations

Phase 3.2: Main Content Components ⏱️ 4-5 hours
Task 3.2.1: Hero Section Component
javascript
// frontend/src/components/HeroSection.jsx
import React from 'react';

const HeroSection = ({ onConnectClick }) => {
  return (
    <section className="hero-section">
      <h1>Securely Connect Your Tools to Stealthy Good</h1>
      <p>
        We use OAuth and the least-privilege permissions required to power your automations. 
        No passwords are stored, and we never train AI models on your data.
      </p>
      
      <button 
        className="primary-cta-button"
        onClick={onConnectClick}
      >
        Choose an app to connect
      </button>
      
      <div className="trust-indicators">
        <span>Least-privilege access</span>
        <span>12+ integrations</span>
        <span>2M+ tasks run</span>
      </div>
    </section>
  );
};

export default HeroSection;
📋 Deliverable: Main content components ready

🎯 Phase 4: Modal System
Day 7-8 | Duration: 8-10 hours

Phase 4.1: App Selection Modal ⏱️ 4-5 hours
Task 4.1.1: App Selection Panel Component
javascript
// frontend/src/components/AppSelectionPanel.jsx
import React, { useState } from 'react';

const apps = [
  { id: 'gmail', label: 'Connect with Gmail', icon: 'gmail' },
  { id: 'hubspot', label: 'Connect with HubSpot', icon: 'hubspot' },
  { id: 'outlook', label: 'Connect with Outlook', icon: 'outlook' },
  { id: 'streak', label: 'Connect with Streak', icon: 'streak' }
];

const AppSelectionPanel = ({ onClose, onSelectApp }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="panel-title">
          Securely connect your tools to Stealthy Good.
        </div>
        
        <div className="app-list">
          {apps.map(app => (
            <button
              key={app.id}
              className="app-button"
              onClick={() => onSelectApp(app)}
            >
              <div className="app-icon-section">
                <img src={`/icons/${app.icon}.svg`} className="app-icon" />
              </div>
              <div className="app-label-section">
                <span className="app-label">{app.label}</span>
              </div>
            </button>
          ))}
        </div>
        
        <button className="browse-more-btn">
          Browse More Apps
        </button>
      </div>
    </div>
  );
};

export default AppSelectionPanel;
📋 Deliverable: App selection modal with beautiful styling

Phase 4.2: Dynamic Form Panel ⏱️ 4-5 hours
Task 4.2.1: Form Modal Component
javascript
// frontend/src/components/DynamicFormPanel.jsx
import React, { useState } from 'react';

const DynamicFormPanel = ({ selectedApp, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    apiKey: '',
    token: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(selectedApp, formData);
  };

  const getFormFields = () => {
    const baseFields = ['name', 'email'];
    
    if (selectedApp?.id === 'hubspot') return [...baseFields, 'apiKey'];
    if (selectedApp?.id === 'streak') return [...baseFields, 'token'];
    return baseFields;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="form-header">
          <div className="form-app-icon">
            <img src={`/icons/${selectedApp?.id}.svg`} className="form-icon" />
          </div>
          <h2 className="form-title">Connect your {selectedApp?.id} Account</h2>
          <p className="form-description">
            We'll securely connect to your account using OAuth 2.0.
          </p>
        </div>

        <form className="dynamic-form" onSubmit={handleSubmit}>
          <div className="form-fields">
            {getFormFields().map(field => (
              <div key={field} className="form-field">
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  className="form-input"
                  placeholder={getPlaceholder(field)}
                  value={formData[field]}
                  onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                  required
                />
              </div>
            ))}
          </div>
          
          <button type="submit" className="form-submit-btn">
            Connect {selectedApp?.id} Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default DynamicFormPanel;
📋 Deliverable: Complete modal system with forms

🔗 Phase 5: Integration & Configuration
Day 9-10 | Duration: 6-8 hours

Phase 5.1: API Integration ⏱️ 3-4 hours
Task 5.1.1: API Service
javascript
// frontend/src/services/api.js
const API_BASE = 'http://localhost:5000'; // Will be configurable

export const apiService = {
  async connectApp(provider, userData) {
    const response = await fetch(`${API_BASE}/oauth/start/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  async saveCredentials(provider, credentialData) {
    const response = await fetch(`${API_BASE}/api/credentials/${provider}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentialData)
    });
    return response.json();
  }
};
📋 Deliverable: Frontend-backend integration complete

Phase 5.2: Single Configuration System ⏱️ 3-4 hours
Task 5.2.1: Create Config File
javascript
// config.js (ROOT LEVEL)
export const CONFIG = {
  ENVIRONMENT: 'local', // 👈 ONLY LINE TO CHANGE
  
  local: {
    FRONTEND_URL: 'http://localhost:3000',
    BACKEND_URL: 'http://localhost:5000',
    N8N_API_URL: 'https://n8n.srv811166.hstgr.cloud'
  },
  
  production: {
    FRONTEND_URL: 'https://stealthy-good.vercel.app',
    BACKEND_URL: 'https://stealthy-good-api.railway.app',
    N8N_API_URL: 'https://n8n.srv811166.hstgr.cloud'
  }
};
Task 5.2.2: Update API Service
javascript
// frontend/src/services/api.js  
import { CONFIG } from '../../config.js';

const API_BASE = CONFIG[CONFIG.ENVIRONMENT].BACKEND_URL;
Task 5.2.3: Main App Component
javascript
// frontend/src/App.jsx
import React, { useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import NavigationBar from './components/NavigationBar';
import HeroSection from './components/HeroSection';
import AppSelectionPanel from './components/AppSelectionPanel';
import DynamicFormPanel from './components/DynamicFormPanel';
import { apiService } from './services/api';

function App() {
  const [showAppSelection, setShowAppSelection] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setShowAppSelection(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (app, formData) => {
    try {
      if (app.id === 'gmail' || app.id === 'outlook') {
        const result = await apiService.connectApp(app.id, formData);
        if (result.authUrl) {
          window.location.href = result.authUrl;
        }
      } else {
        const result = await apiService.saveCredentials(app.id, formData);
        console.log('Credentials saved:', result);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <AnimatedBackground>
      <NavigationBar />
      <HeroSection onConnectClick={() => setShowAppSelection(true)} />
      
      {showAppSelection && (
        <AppSelectionPanel 
          onClose={() => setShowAppSelection(false)}
          onSelectApp={handleAppSelect}
        />
      )}
      
      {showForm && (
        <DynamicFormPanel
          selectedApp={selectedApp}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </AnimatedBackground>
  );
}

export default App;
📋 Deliverable: Complete application with single configuration system

🚀 Final Testing & Deployment
Testing Commands:
bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Test complete OAuth flow
# Verify all modals and animations work
Production Deployment:
bash
# Build frontend
cd frontend && npm run build

# Deploy frontend to Vercel
vercel --prod

# Deploy backend to Railway
railway deploy
🎯 Final Result: Beautiful OAuth platform with single-file backend, optimized React frontend, and one-line configuration switching between local and production environments.

do the same for this one also