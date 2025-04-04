import React from 'react';
import placeholderImage from '../assets/depositphotos_104564156-stock-illustration-male-user-icon.jpg';

interface CreditsPageProps {
  navigateTo: (page: string) => void;
}

const CreditsPage: React.FC<CreditsPageProps> = ({ navigateTo }) => {
  return (
    <div className="about-container">
      <h1 className="about-title" style={{ color: 'white' }}>Credits</h1>
      
      <div className="about-content">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Website Development</h2>
          <ul style={{ listStyleType: 'none', color: 'white' }}>
            <li>Design & Implementation: JHU ACM Web Team</li>
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
          {/* First row of contributors */}
          <div style={{ textAlign: 'center' }}>
            <img src={placeholderImage} alt="Contributor" style={{ width: '100%' }} />
            <p style={{ color: 'white', marginTop: '10px' }}>John Doe</p>
            <p style={{ color: 'white', fontSize: '0.9rem' }}>Lead Developer</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={placeholderImage} alt="Contributor" style={{ width: '100%' }} />
            <p style={{ color: 'white', marginTop: '10px' }}>Jane Smith</p>
            <p style={{ color: 'white', fontSize: '0.9rem' }}>UI/UX Designer</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={placeholderImage} alt="Contributor" style={{ width: '100%' }} />
            <p style={{ color: 'white', marginTop: '10px' }}>Alex Johnson</p>
            <p style={{ color: 'white', fontSize: '0.9rem' }}>Backend Developer</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={placeholderImage} alt="Contributor" style={{ width: '100%' }} />
            <p style={{ color: 'white', marginTop: '10px' }}>Sam Wilson</p>
            <p style={{ color: 'white', fontSize: '0.9rem' }}>Content Manager</p>
          </div>
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
          <p><a href="mailto:acm@jhu.edu" style={{ color: 'white', textDecoration: 'underline' }}>jhuacmofficers@gmail.com</a></p>
        </div>
      </div>
      
      <button 
        className="home-button" 
        onClick={() => navigateTo('home')}
        style={{ 
          padding: '8px 16px',
          backgroundColor: '#3366cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Back to Home
      </button>
      
      <div 
        onClick={() => navigateTo('credits')}
        style={{ 
          fontSize: '0.8rem', 
          textAlign: 'center', 
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          color: 'white',
          opacity: 0.8,
          cursor: 'pointer',
          backgroundColor: 'rgba(50, 50, 50, 0.5)',
          padding: '8px 0',
          backdropFilter: 'blur(2px)'
        }}
      >
        made with lots of ❤️ @JHU ACM
      </div>
    </div>
  );
};

export default CreditsPage; 