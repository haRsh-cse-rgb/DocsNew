import React from 'react';

const socialLinks = {
  whatsapp: 'https://chat.whatsapp.com/your-group-link',
  telegram: 'https://t.me/your-group-link',
  instagram: 'https://instagram.com/your-profile',
};

const iconStyle = {
  width: 50,
  height: 50,
  borderRadius: '50%',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  fontSize: 32,
  transition: 'transform 0.2s',
};

const FloatingSocialButtons = () => (
  <div style={{
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    zIndex: 1000,
  }}>
    <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" style={iconStyle} title="Join WhatsApp Group">
      <span role="img" aria-label="WhatsApp">🟢</span>
    </a>
    <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" style={iconStyle} title="Join Telegram Group">
      <span role="img" aria-label="Telegram">🔵</span>
    </a>
    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={iconStyle} title="Join Instagram Group">
      <span role="img" aria-label="Instagram">🟣</span>
    </a>
  </div>
);

export default FloatingSocialButtons; 