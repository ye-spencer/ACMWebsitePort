import React from 'react';

interface AboutPageProps {
  navigateTo: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ navigateTo }) => {
  return (
    <div className="about-container">
      <h1 className="about-title">About ACM</h1>
      <div className="about-content">
        <p>
          The Association for Computing Machinery (ACM) is a global scientific and educational organization dedicated 
          to advancing computing as a science and profession.
        </p>
        <p>
          Our local chapter focuses on providing resources, events, and community for students interested in 
          computer science and technology.
        </p>
        <p>
          We organize workshops, hackathons, tech talks, and social events throughout the year to help members 
          develop their skills and build connections.
        </p>
      </div>
      <button className="home-button" onClick={() => navigateTo('home')}>Back to Home</button>
    </div>
  );
};

export default AboutPage; 