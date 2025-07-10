import React, { useState } from 'react';
import placeholderImage from '../assets/depositphotos_104564156-stock-illustration-male-user-icon.jpg';
import { leadershipData } from '../data/leadership';
import { alumniData } from '../data/alumni';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';
import '../styles/AboutPage.css';
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

  return (
    <div className="about-page">
      <div className="about-layout">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Learn more about the Johns Hopkins ACM chapter</p>
        </div>

        {error && (
          <div className="about-section error-section">
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* About Content Section */}
        <div className="about-section">
          <h2 className="section-title">Our Mission</h2>
          <div className="about-content">
            <p className="about-description">
              We are a student organization of the Johns Hopkins University dedicated to furthering the knowledge and advancement of computers and 
              information technology through the free exchange of ideas and information. As a chapter of the oldest computing society in the world, the JHU ACM 
              is a place for diverse backgrounds and interests, and serves the JHU community as a whole. During the semester, the ACM has weekly meetings in 
              Malone announced via email and posted on our <a href="https://www.instagram.com/jhuacm/" className="about-link" target="_blank" rel="noopener noreferrer">Instagram</a> page and the <a onClick={() => navigateTo('events')} className="about-link">Events</a> section of this website.
            </p>

            <div className="contact-section">
              <h3 className="contact-title">Get in Touch</h3>
              <div className="contact-links">
                <a 
                  href="https://www.instagram.com/jhuacm/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-item"
                >
                  <FaInstagram size={20} />
                  <span>@jhuacm</span>
                </a>
                <a 
                  href="mailto:jhuacmofficers@gmail.com" 
                  className="contact-item"
                >
                  <FaEnvelope size={20} />
                  <span>jhuacmofficers@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Officers Section */}
        <div className="about-section">
          <h2 className="section-title">Officers</h2>
          <div className="members-grid">
            {leadershipData.map((leader, index) => (
              <div 
                key={index} 
                className={`flip-card ${flippedCards.includes(index) ? 'flipped' : ''}`}
                onClick={() => toggleFlip(index)}
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
                  <div className="flip-card-back">
                    <h3 className="member-name">{leader.name}</h3>
                    <h4 className="member-role">{leader.role}</h4>
                    <p className="member-bio">{leader.bio}</p>
                    <a 
                      href={leader.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="member-linkedin"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Alumni Section */}
        <div className="about-section">
          <h2 className="section-title">Alumni</h2>
          <div className="members-grid">
            {alumniData.map((alumni, index) => (
              <div 
                key={index} 
                className={`flip-card ${flippedAlumniCards.includes(index) ? 'flipped' : ''}`}
                onClick={() => toggleAlumniFlip(index)}
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
                  <div className="flip-card-back">
                    <h3 className="member-name">{alumni.name}</h3>
                    <h4 className="member-role">{alumni.role}</h4>
                    <p className="member-bio">{alumni.bio}</p>
                    <a 
                      href={alumni.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="member-linkedin"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 