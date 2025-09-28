import React from 'react';
import { contributorsData } from '../data/contributors';
import { FaEnvelope } from 'react-icons/fa';
import FlipCard from '../components/FlipCard';
import { useApp } from '../hooks/useApp';
import '../styles/Pages.css';
import '../styles/CreditsPage.css';

const CreditsPage: React.FC = () => {
  const { error } = useApp();

  return (
    <div className="page">
      <div className="page-layout">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Credits</h1>
          <p className="page-subtitle">Acknowledgments and contributors to this project</p>
        </div>

        {error && (
          <div className="page-section error-section">
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* Contributors Section - Full Width, First */}
        <div className="page-section contributors-section">
          <h2 className="section-title">Contributors</h2>
          <FlipCard data={contributorsData} />
        </div>
        
        {/* Side by Side: Website Development and Special Thanks */}
        <div className="side-by-side-container">
          {/* Website Development Section */}
          <div className="development-section">
            <h2 className="section-title">Website Development</h2>
            <div className="credit-info">
              <div className="credit-item">
                <h3 className="credit-label">Brought to you by:</h3>
                <p className="credit-value">Spring 2025 JHU ACM Coding Circle</p>
              </div>
              <div className="credit-item">
                <h3 className="credit-label">Framework:</h3>
                <p className="credit-value">React with TypeScript</p>
              </div>
            </div>
          </div>
          
          {/* Special Thanks Section */}
          <div className="thanks-section">
            <h2 className="section-title">Special Thanks</h2>
            <div className="thanks-list">
              <div className="thanks-item">JHU Computer Science Department</div>
              <div className="thanks-item">ACM National Organization</div>
              <div className="thanks-item">All our dedicated members</div>
            </div>
          </div>
        </div>
        
        {/* Contact Section - Smaller, Less Prominent */}
        <div className="contact-section-small">
          <h2 className="section-title">Contact</h2>
          <p className="contact-description">
            For questions or feedback about this website, please contact us:
          </p>
          <div className="contact-links-small">
            <a 
              href="mailto:jhuacmweb@gmail.com" 
              className="contact-item-small"
            >
              <FaEnvelope size={16} />
              <span>jhuacmweb@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage; 
