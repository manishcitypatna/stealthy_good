# Stealthy Good Simplified - Phase by Phase Build Plan 🚀

## 📋 Project Overview
- **Objective:** Build simplified OAuth integration platform with beautiful UI  
- **Architecture:** Minimal React frontend (serverless) + Single-file Node.js backend  
- **Timeline:** 10 days (2 phases per day)

---

## 🏗️ Phase 1: Project Foundation & Backend Setup
**Day 1-2 | Duration: 8-10 hours**

### Phase 1.1: Project Structure Creation ⏱️ 2 hours
**Task 1.1.1: Initialize Project Directory**
```bash
mkdir stealthy-good-simplified
cd stealthy-good-simplified

# Create directory structure
mkdir -p backend
mkdir -p frontend/src
mkdir -p frontend/public
mkdir -p docs
```

**Task 1.1.2: Backend Package Setup**
```bash
cd backend

# Initialize package.json
npm init -y

# Install dependencies (exact multi-auth pattern)
npm install express cors axios dotenv

# Install dev dependencies
npm install --save-dev nodemon
```

📋 **Deliverable:** Clean project structure with backend dependencies installed  

---

### Phase 1.2: Backend Implementation ⏱️ 6-8 hours
**Task 1.2.1: Create Single Backend File**
```javascript
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
```
*(Truncated for brevity — includes OAuth routes, n8n integration, API key handlers, helper functions, app.listen())*  

**Task 1.2.2: Environment Configuration**
```bash
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
```

**Task 1.2.3: Update Package.json Scripts**
```json
// backend/package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

📋 **Deliverable:** Complete backend with OAuth + n8n integration  

---

## 🎨 Phase 2: Frontend Foundation
**Day 3-4 | Duration: 8-10 hours**

### Phase 2.1: React Setup ⏱️ 2-3 hours
```bash
cd frontend
npm create vite@latest . -- --template react

# Install minimal dependencies
npm install react-router-dom axios
```
*(Includes vite.config.js and package.json setup)*  

📋 **Deliverable:** React development environment ready  

### Phase 2.2: Core CSS & Design System ⏱️ 5-7 hours
*(variables.css, animations.css, modals.css with full styling system)*  

📋 **Deliverable:** Complete CSS design system with animations  

---

## ⚙️ Phase 3: Core Components
**Day 5-6 | Duration: 8-10 hours**  
- AnimatedBackground.jsx  
- NavigationBar.jsx  
- HeroSection.jsx  

📋 **Deliverable:** Core layout + main content components  

---

## 🎯 Phase 4: Modal System
**Day 7-8 | Duration: 8-10 hours**  
- AppSelectionPanel.jsx  
- DynamicFormPanel.jsx  

📋 **Deliverable:** App selection + dynamic form modals  

---

## 🔗 Phase 5: Integration & Configuration
**Day 9-10 | Duration: 6-8 hours**  

- API service setup (`frontend/src/services/api.js`)  
- Root-level config.js for local/production switch  
- Main App.jsx integration  

📋 **Deliverable:** Fully functional app with configuration system  

---

## 🚀 Final Testing & Deployment

**Testing Commands:**
```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev
```

**Production Deployment:**
```bash
# Build frontend
cd frontend && npm run build

# Deploy frontend to Vercel
vercel --prod

# Deploy backend to Railway
railway deploy
```

🎯 **Final Result:** Beautiful OAuth platform with single-file backend, optimized React frontend, and one-line configuration switching between local and production environments.
