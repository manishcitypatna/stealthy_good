import React from 'react';

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
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <div className="modal-title">
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
                  <div className="app-icon">{app.id[0].toUpperCase()}</div>
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
          
          <div className="modal-footer">
            <p>Least-privilege access | 12+ integrations | 2M+ tasks run</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSelectionPanel;
