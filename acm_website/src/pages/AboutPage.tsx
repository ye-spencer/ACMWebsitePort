import React from 'react';
import { leadershipData } from '../data/leadership';
import { alumniData } from '../data/alumni';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';
import FlipCard from '../components/FlipCard';
import '../styles/AboutPage.css';

interface AboutPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ navigateTo, error }) => {
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
          <FlipCard data={leadershipData} />
        </div>
        
        {/* Alumni Section */}
        <div className="about-section">
          <h2 className="section-title">Alumni</h2>
          <FlipCard data={alumniData} />
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 