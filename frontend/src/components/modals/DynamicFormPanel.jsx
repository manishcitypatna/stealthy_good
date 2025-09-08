import React, { useState } from 'react';

const DynamicFormPanel = ({ selectedApp, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    apiKey: '',
    token: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(selectedApp, formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormFields = () => {
    const baseFields = ['name', 'email'];
    if (selectedApp?.id === 'hubspot') return [...baseFields, 'apiKey'];
    if (selectedApp?.id === 'streak') return [...baseFields, 'token'];
    return baseFields;
  };

  const getPlaceholder = (field) => {
    switch(field) {
      case 'name': return 'Full Name';
      case 'email': return 'Email Address';
      case 'apiKey': return 'HubSpot Private App Token';
      case 'token': return 'Streak API Token';
      default: return '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <div className="form-header">
            <div className="form-app-icon">
              <div className="form-icon">{selectedApp?.id?.[0]?.toUpperCase()}</div>
            </div>
            <h2 className="form-title">Connect your {selectedApp?.label || selectedApp?.id} Account</h2>
            <p className="form-description">
              {selectedApp?.id === 'gmail' || selectedApp?.id === 'outlook' 
                ? "We'll securely connect to your account using OAuth 2.0."
                : "Please enter your API credentials below."
              }
            </p>
          </div>

          <form className="dynamic-form" onSubmit={handleSubmit}>
            <div className="form-fields">
              {getFormFields().map(field => (
                <div key={field} className="form-field">
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={getPlaceholder(field)}
                    value={formData[field]}
                    onChange={e => setFormData({...formData, [field]: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
              ))}
            </div>
            
            <button 
              type="submit" 
              className="form-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Connecting...' : `Connect ${selectedApp?.id} Account`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormPanel;
