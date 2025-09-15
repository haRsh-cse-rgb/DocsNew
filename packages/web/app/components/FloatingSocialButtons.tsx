"use client"

import React, { useEffect, useState } from 'react';
import styles from './FloatingSocialButtons.module.css';

const iconData = [
  { name: 'WhatsApp', href: 'https://chat.whatsapp.com/EZ4w1JWnHPZBVPIiPfRclM?mode=ems_share_t', icon: '/whatsaap.svg' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/i-india-jobs/?viewAsMember=true', icon: '/linkedin.svg' },
  { name: 'Instagram', href: 'https://www.instagram.com/indiajobs.path?igsh=b2RmeWRmbGNqNWV3', icon: '/instagram.svg' },
];

const FloatingSocialButtons: React.FC = () => {
  const [attention, setAttention] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttention(true);
      setTimeout(() => setAttention(false), 700); // match bounce duration
    }, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.floatingButtons}>
      {iconData.map(({ name, href, icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.floatingButton + (attention ? ' ' + styles.attention : '')}
          title={`Join ${name} Group`}
        >
          <img src={icon} alt={name} />
        </a>
      ))}
    </div>
  );
};

export default FloatingSocialButtons; 