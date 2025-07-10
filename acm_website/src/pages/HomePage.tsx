import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  error?: string;
}

const HomePage: React.FC<HomePageProps> = ({ error }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <div className="relative w-full page-container">
      {/* Welcome Section */}
      <div className="welcome-section-full">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome to ACM@Hopkins</h1>
        </div>
      </div>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Hero Section */}
      <div className="hero-section-full">
        <div className="hero-content">
          <div className="hero-inner">
            <h2 className="hero-title">
              Your Journey in Computing Starts Here!
            </h2>
            <p className="hero-description">
              At ACM Hopkins, we inspire and equip students to explore the frontiers of computing. Whether you're a seasoned programmer or just starting your journey, our community fosters collaboration, innovation, and growth.
            </p>

            {/* Feature Cards */}
            <div className="max-w-3xl mx-auto">
              <div className="cards-container">
                <div className="feature-card">
                  <h4 className="card-title">Connect</h4>
                  <p className="card-description">Network with peers and industry leaders.</p>
                </div>
                <div className="feature-card">
                  <h4 className="card-title">Learn</h4>
                  <p className="card-description">Attend workshops, seminars, and coding challenges.</p>
                </div>
                <div className="feature-card">
                  <h4 className="card-title">Create</h4>
                  <p className="card-description">Work on exciting projects and hackathons that make a difference.</p>
                </div>
              </div>

              <div className="cta-container">
                <span className="cta-text">Get Involved</span>
                <button
                  className="cta-button"
                  onClick={() => navigate(isLoggedIn ? '/events' : '/login')}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="cta-arrow"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;