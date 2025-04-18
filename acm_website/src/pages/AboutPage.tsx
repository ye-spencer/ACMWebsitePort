import React, { useState } from 'react';
import placeholderImage from '../assets/depositphotos_104564156-stock-illustration-male-user-icon.jpg';
import miseokImage from '../assets/alumni/miseok kim.jpg';
import juliaImage from '../assets/alumni/julia bian.jpeg';
import nishImage from '../assets/alumni/nish.jpeg';
import chaseImage from '../assets/alumni/chase feng.jpeg';
import backgroundImage from '../assets/aboutus_background.webp';
import '../styles/FlipCard.css';

interface AboutPageProps {
  navigateTo: (page: string) => void;
}

interface PersonData {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  imagePath?: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ navigateTo }) => {
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

  // Leadership data
  const leadershipData: PersonData[] = [
    { 
      name: "Alan Li", 
      role: "President", 
      bio: "2026",
      linkedin: "https://www.linkedin.com/in/alanli6/",
      imagePath: "/images/team/alan.jpg"
    },
    { 
      name: "Elizabeth Fu", 
      role: "Vice President", 
      bio: "2027",
      linkedin: "https://www.linkedin.com/in/elizabeth-fu",
      imagePath: "/images/team/elizabeth.jpg"
    },
    { 
      name: "Spencer Ye", 
      role: "Treasurer", 
      bio: "2027",
      linkedin: "https://www.linkedin.com/in/spencerye/",
      imagePath: "/images/team/spencer.jpg"
    },
    { 
      name: "Christian Byun", 
      role: "Secretary", 
      bio: "2028",
      linkedin: "https://www.linkedin.com/in/christian-byun",
      imagePath: "/images/team/christian.jpg"
    },
    { 
      name: "Timothy Lin", 
      role: "ICPC Head", 
      bio: "2026",
      linkedin: "https://www.linkedin.com/in/tlin2004/",
      imagePath: "/images/team/timothy.jpg"
    },
    { 
      name: "Liam Finn", 
      role: "Outreach Chair", 
      bio: "2027",
      linkedin: "https://www.linkedin.com/in/liam-finn-11o37/",
      imagePath: "/images/team/liam.jpg"
    },
    { 
      name: "Tianai Yue", 
      role: "Events Chair", 
      bio: "2026",
      linkedin: "https://www.linkedin.com/in/tianai-yue-70981523b/",
      imagePath: "/images/team/tianai.jpg"
    }
  ];

  // Alumni data
  const alumniData: PersonData[] = [
    { 
      name: "Miseok Kim", 
      role: "2025", 
      bio: "Google",
      linkedin: "https://www.linkedin.com/in/miseok-k-aa4202195/",
      imagePath: miseokImage
    },
    { 
      name: "Julia Bian", 
      role: "2024", 
      bio: "Meta",
      linkedin: "https://www.linkedin.com/in/juliabian/",
      imagePath: juliaImage
    },
    { 
      name: "Nish Paruchuri", 
      role: "2024", 
      bio: "MS @ Stanford",
      linkedin: "https://www.linkedin.com/in/nishikarp/",
      imagePath: nishImage
    },
    { 
      name: "Chase Feng", 
      role: "2025", 
      bio: "IMC Trading",
      linkedin: "https://www.linkedin.com/in/chasejhu/",
      imagePath: chaseImage
    }
  ];

  return (
    <div className="about-container" style={{ 
      position: 'relative',
      minHeight: '100vh',
      width: '100vw',
      padding: '40px 20px',
      zIndex: 1
    }}>
      <div className="about-background" style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#001531',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        zIndex: -1
      }}></div>
      <h1 className="about-title" style={{ color: 'white', position: 'relative', zIndex: 2 }}>About Us</h1>
      
      <div className="about-content" style={{ position: 'relative', zIndex: 2 }}>
        <p style={{ color: 'white' }}>
          We are a student organization of the Johns Hopkins University dedicated to furthering the knowledge and advancement of computers and 
          information technology through the free exchange of ideas and information. As a chapter of the oldest computing society in the world, the JHU ACM 
          is a place for diverse backgrounds and interests, and serves the JHU community as a whole. During the semester, the ACM has weekly meetings in 
          Malone announced via email and posted on our <a href="#" className="link" style={{ color: 'white', textDecoration: 'underline' }}>Facebook</a> page and the <a href="#" className="link" style={{ color: 'white', textDecoration: 'underline' }}>Events</a> section of this website.
        </p>
      </div>
      
      <h2 className="leadership-title" style={{ color: 'white', position: 'relative', zIndex: 2 }}>Officers</h2>
      
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
              <div className="flip-card-back">
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{leader.name}</h3>
                <h4 style={{ margin: '0 0 5px 0', fontWeight: 'normal', fontSize: '0.9rem' }}>{leader.role}</h4>
                <p style={{ fontSize: '0.8rem', margin: '0 0 8px 0' }}>{leader.bio}</p>
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
              <div className="flip-card-back">
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{alumni.name}</h3>
                <h4 style={{ margin: '0 0 5px 0', fontWeight: 'normal', fontSize: '0.9rem' }}>{alumni.role}</h4>
                <p style={{ fontSize: '0.8rem', margin: '0 0 8px 0' }}>{alumni.bio}</p>
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
      
      <button className="home-button" onClick={() => navigateTo('home')}>Back to Home</button>
      
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

export default AboutPage; 