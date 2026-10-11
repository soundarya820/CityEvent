import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p>© {new Date().getFullYear()} CityEvent – Local Event Discovery & Management Platform.</p>
        <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>
          Built with MERN Stack • College Project Architecture
        </p>
      </div>
    </footer>
  );
};
