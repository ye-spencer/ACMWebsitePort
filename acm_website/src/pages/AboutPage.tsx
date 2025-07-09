import React, { useState } from 'react';
import placeholderImage from '../assets/depositphotos_104564156-stock-illustration-male-user-icon.jpg';
import { leadershipData } from '../data/leadership';
import { alumniData } from '../data/alumni';
import '../styles/FlipCard.css';

interface AboutPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ navigateTo, error }) => {
  // State to track which cards are flipped
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [flippedAlumniCards, setFlippedAlumniCards] = useState<number[]>([]);


  // Toggle flip state for a card
  const toggleFlip = (index: number) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter(i => i !== index));
    } else {
      setFlippedCards([...flippedCards, index]);
    }
  };

  // Toggle flip state for an alumni card
  const toggleAlumniFlip = (index: number) => {
    if (flippedAlumniCards.includes(index)) {
      setFlippedAlumniCards(flippedAlumniCards.filter(i => i !== index));
    } else {
      setFlippedAlumniCards([...flippedAlumniCards, index]);
    }
  };

  // Leadership and alumni data now sourced from data files

  return (
    <div className="about-container" style={{ position: 'relative', zIndex: 1 }}>
      {error && (
            <div className="error-message">
              {error}
            </div>
          )}
      <h1 className="about-title" style={{ position: 'relative', zIndex: 2, color: 'white' }}>About Us</h1>
      
      <div className="about-content" style={{ position: 'relative', zIndex: 2 }}>
        <p style={{ color: 'white' }}>
          We are a student organization of the Johns Hopkins University dedicated to furthering the knowledge and advancement of computers and 
          information technology through the free exchange of ideas and information. As a chapter of the oldest computing society in the world, the JHU ACM 
          is a place for diverse backgrounds and interests, and serves the JHU community as a whole. During the semester, the ACM has weekly meetings in 
          Malone announced via email and posted on our <a href="#" className="link" style={{ color: 'white', textDecoration: 'underline' }}>Facebook</a> page and the <a href="#" className="link" style={{ color: 'white', textDecoration: 'underline' }}>Events</a> section of this website.
        </p>
      </div>
      
      <h2 className="leadership-title" style={{ position: 'relative', zIndex: 2, color: 'white' }}>Officers</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        margin: '30px 0' 
      }}>
        {leadershipData.map((leader, index) => (
          <div 
            key={index} 
            className={`flip-card ${flippedCards.includes(index) ? 'flipped' : ''}`}
            onClick={() => toggleFlip(index)}
            style={{ cursor: 'pointer' }}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img 
                  src={leader.imagePath || placeholderImage} 
                  alt={`${leader.name}`} 
                  onError={(e) => {
                    e.currentTarget.src = placeholderImage;
                  }}
                />
              </div>
              <div className="flip-card-back" style={{ color: 'white' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'white' }}>{leader.name}</h3>
                <h4 style={{ margin: '0 0 5px 0', fontWeight: 'normal', fontSize: '0.9rem', color: 'white' }}>{leader.role}</h4>
                <p style={{ fontSize: '0.8rem', margin: '0 0 8px 0', color: 'white' }}>{leader.bio}</p>
                <a 
                  href={leader.linkedin} 
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
      
      <h2 className="alumni-title" style={{ color: 'white', marginTop: '40px' }}>Alumni</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        margin: '30px 0' 
      }}>
        {alumniData.map((alumni, index) => (
          <div 
            key={index} 
            className={`flip-card ${flippedAlumniCards.includes(index) ? 'flipped' : ''}`}
            onClick={() => toggleAlumniFlip(index)}
            style={{ cursor: 'pointer' }}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img 
                  src={alumni.imagePath || placeholderImage} 
                  alt={`${alumni.name}`} 
                  onError={(e) => {
                    e.currentTarget.src = placeholderImage;
                  }}
                />
              </div>
              <div className="flip-card-back" style={{ color: 'white' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'white' }}>{alumni.name}</h3>
                <h4 style={{ margin: '0 0 5px 0', fontWeight: 'normal', fontSize: '0.9rem', color: 'white' }}>{alumni.role}</h4>
                <p style={{ fontSize: '0.8rem', margin: '0 0 8px 0', color: 'white' }}>{alumni.bio}</p>
                <a 
                  href={alumni.linkedin} 
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
    </div>
  );
};

export default AboutPage; 