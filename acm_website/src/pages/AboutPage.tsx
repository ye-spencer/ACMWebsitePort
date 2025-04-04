import React from 'react';
import placeholderImage from '../assets/depositphotos_104564156-stock-illustration-male-user-icon.jpg';

interface AboutPageProps {
  navigateTo: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ navigateTo }) => {
  return (
    <div className="about-container">
      <h1 className="about-title" style={{ color: 'white' }}>About Us</h1>
      
      <div className="about-content">
        <p style={{ color: 'white' }}>
          We are a student organization of the Johns Hopkins University dedicated to furthering the knowledge and advancement of computers and 
          information technology through the free exchange of ideas and information. As a chapter of the oldest computing society in the world, the JHU ACM 
          is a place for diverse backgrounds and interests, and serves the JHU community as a whole. During the semester, the ACM has weekly meetings in 
          Malone announced via email and posted on our <a href="#" className="link" style={{ color: 'white', textDecoration: 'underline' }}>Facebook</a> page and the <a href="#" className="link" style={{ color: 'white', textDecoration: 'underline' }}>Events</a> section of this website.
        </p>
      </div>
      
      <h2 className="leadership-title" style={{ color: 'white' }}>Leadership</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        margin: '30px 0' 
      }}>
        {/* First row of leadership */}
        <div style={{ textAlign: 'center' }}>
          <img src={placeholderImage} alt="Leadership member" style={{ width: '100%' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={placeholderImage} alt="Leadership member" style={{ width: '100%' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={placeholderImage} alt="Leadership member" style={{ width: '100%' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={placeholderImage} alt="Leadership member" style={{ width: '100%' }} />
        </div>
        
        {/* Second row of leadership */}
        <div style={{ textAlign: 'center' }}>
          <img src={placeholderImage} alt="Leadership member" style={{ width: '100%' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={placeholderImage} alt="Leadership member" style={{ width: '100%' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={placeholderImage} alt="Leadership member" style={{ width: '100%' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={placeholderImage} alt="Leadership member" style={{ width: '100%' }} />
        </div>
      </div>
      
      <button className="home-button" onClick={() => navigateTo('home')}>Back to Home</button>
      
      <div style={{ 
        fontSize: '0.8rem', 
        textAlign: 'center', 
        position: 'fixed',
        bottom: '10px',
        left: '0',
        right: '0',
        color: 'white',
        opacity: 0.8
      }}>
        made with lots of ❤️ @JHU ACM
      </div>
    </div>
  );
};

export default AboutPage; 