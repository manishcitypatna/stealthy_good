import React from 'react';

const IntegrationsScroll = () => {
  const integrations = [
    'Outlook', 'OpenAI', 'Meta', 'G-Sheet', 'Figma', 
    'Gmail', 'Nvidia', 'HubSpot', 'Notion', 'Slack',
    'Dropbox', 'Trello', 'Stripe', 'Discord', 'Zoom'
  ];

  // Duplicate for seamless scroll
  const duplicatedIntegrations = [...integrations, ...integrations];

  return (
    <div className="integrations-scroll-container">
      <div className="integrations-header">Our active integrations</div>
      <div className="scroll-wrapper">
        <div className="scroll-content">
          {duplicatedIntegrations.map((integration, index) => (
            <div key={index} className="scroll-item">
              <div className="integration-icon">
                {integration.charAt(0)}
              </div>
              <span>{integration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsScroll;
