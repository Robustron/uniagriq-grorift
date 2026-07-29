import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PageHeader.css';

export default function PageHeader({ title, icon: Icon, iconColor = '#10b981' }) {
  return (
    <header className="page-header">
      <div className="page-header-inner">
        <Link to="/" className="page-header-back" aria-label="Back to Home">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        <div className="page-header-brand">
          <img src="/logo.png" alt="UniAgriQ Logo" className="page-header-logo" />
          <div className="page-header-title-wrap">
            {Icon && <Icon size={22} color={iconColor} />}
            <span className="page-header-title">{title}</span>
          </div>
        </div>

        <div style={{ width: '140px' }} />
      </div>
    </header>
  );
}
