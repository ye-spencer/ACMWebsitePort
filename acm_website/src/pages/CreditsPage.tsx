import React, { useState } from 'react';
import placeholderImage from '../assets/depositphotos_104564156-stock-illustration-male-user-icon.jpg';
import '../styles/FlipCard.css';
import { contributorsData } from '../data/contributors';

interface CreditsPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}


const CreditsPage: React.FC<CreditsPageProps> = ({ navigateTo, error }) => {
  // State to track which cards are flipped
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Toggle flip state for a card
  const toggleFlip = (index: number) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter(i => i !== index));
    } else {
      setFlippedCards([...flippedCards, index]);
    }
  };

  // Contributors data sourced from a separate file

  return (
    <div className="about-container" style={{ position: 'relative', zIndex: 1 }}>
      {error && (
        <div className="error-message" style={{ position: 'relative', zIndex: 2 }}>
          {error}
        </div>
      )}
      <h1 className="about-title" style={{ color: 'white', position: 'relative', zIndex: 2 }}>Credits</h1>
      
      <div className="about-content" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Website Development</h2>
          <ul style={{ listStyleType: 'none', color: 'white' }}>
            <li>Brought to you by: Spring 2025 JHU ACM Coding Circle</li>
            <li>Framework: React with TypeScript</li>
          </ul>
        </div>
        
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Contributors</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px', 
          margin: '30px 0' 
        }}>
          {contributorsData.map((contributor, index) => (
            <div 
              key={index} 
              className={`flip-card ${flippedCards.includes(index) ? 'flipped' : ''}`}
              onClick={() => toggleFlip(index)}
              style={{ cursor: 'pointer' }}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img 
                    src={contributor.imagePath || placeholderImage} 
                    alt={`${contributor.name}`} 
                    onError={(e) => {
                      e.currentTarget.src = placeholderImage;
                    }}
                  />
                </div>
                <div className="flip-card-back">
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{contributor.name}</h3>
                  <h4 style={{ margin: '0 0 5px 0', fontWeight: 'normal', fontSize: '0.8rem' }}>{contributor.role}</h4>
                  <p style={{ fontSize: '0.8rem', margin: '0 0 8px 0', color: 'inherit' }}>{contributor.bio}</p>
                  <a 
                    href={contributor.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color: '#0077b5',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      backgroundColor: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginBottom: '30px', marginTop: '30px' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Special Thanks</h2>
          <ul style={{ listStyleType: 'none', color: 'white' }}>
            <li>JHU Computer Science Department</li>
            <li>ACM National Organization</li>
            <li>All our dedicated members</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Contact</h2>
          <p style={{ color: 'white' }}>For questions or feedback about this website, please contact:</p>
          <p><a href="mailto:acm@jhu.edu" style={{ color: 'white', textDecoration: 'underline' }}>acm@jhu.edu</a></p>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage; 
