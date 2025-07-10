import React from 'react';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';

interface HomePageProps {
  error?: string;
}

const HomePage: React.FC<HomePageProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-layout">
        {error && (
          <div className="home-section error-section">
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* Single Full-Screen Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">Johns Hopkins University</span>
            </div>
            
            <h1 className="hero-title">
              ACM <span className="hero-highlight">@Hopkins</span>
            </h1>
            
            <p className="hero-subtitle">
              Where Innovation Meets Opportunity
            </p>
            
            <p className="hero-description">
              Join the premier computing society at Johns Hopkins University. We're building the next generation of 
              technology leaders through collaborative learning, cutting-edge projects, and industry connections.
            </p>
            
            <div className="hero-actions">
              <button 
                className="secondary-cta"
                onClick={() => navigate('/about')}
              >
                Learn More
              </button>
            </div>

            {/* TODO: Add actual stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Active Members</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Events Annually</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Industry Partners</span>
              </div>
            </div>

            <div className="quick-actions">
              <button 
                className="quick-action"
                onClick={() => navigate('/events')}
              >
                <FaCalendarAlt />
                <span>View Events</span>
              </button>
              <button 
                className="quick-action"
                onClick={() => navigate('/booking')}
              >
                <FaUsers />
                <span>Book Space</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;