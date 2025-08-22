import React from 'react';
import './TopBar.css';

interface TopBarProps {
  companyName: string;
}

const TopBar: React.FC<TopBarProps> = ({ companyName }) => {
  return (
    <div className="top-bar">
      <div className="logo">
        <img src="/vite.svg" alt="Logo" />
        <h1>Document Checklist App</h1>
      </div>
      <h2>Hello, {companyName || 'Guest'}</h2>
    </div>
  );
};

export default TopBar;
