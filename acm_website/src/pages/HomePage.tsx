import React from 'react';
import '../styles/HomePage.css';
import { useApp } from '../contexts/AppContext';
import FlipCard from '../components/FlipCard';
import { leadershipData } from '../data/leadership';

const HomePage: React.FC = () => {
  const { error } = useApp();

  return (
    <div className="homepage page-container">
      {error && <div className="error-message">{error}</div>}
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to ACM@Hopkins</h1>
        <p className="welcome-description">
          Join the largest computer science organization at Johns Hopkins University
        </p>
      </div>
      <div className="cards-container">
        <FlipCard data={leadershipData} />
      </div>
    </div>
  );
};

export default HomePage;