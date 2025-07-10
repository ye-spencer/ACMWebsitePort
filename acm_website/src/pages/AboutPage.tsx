import React from 'react';
import { leadershipData } from '../data/leadership';
import { alumniData } from '../data/alumni';
import { FaInstagram, FaEnvelope, FaCalendar } from 'react-icons/fa';
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
              Malone announced via email and posted on our <a href="https://www.instagram.com/jhuacm/" className="about-link" target="_blank" rel="noopener noreferrer">Instagram</a> page and the <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('events'); }} className="about-link">Events</a> section of this website.
            </p>

            <div className="benefits-section">
              <h3 className="benefits-title">Membership Benefits</h3>
              <p className="about-description">
                You can participate in exciting projects to bring new and interesting services to the JHU community, and voice your concerns about issues like information access, security, and privacy. You'll receive an account on our computer system that grants you access to a huge, ever-increasing range of services.
              </p>
              <p className="about-description">
                You'll be able to use the workstations and printers in our office in Malone Hall, have 50 GiB of storage space on our systems that you can access from anywhere in the world, host a website using that storage space, run virtual machines on our cluster, get email at acm.jhu.edu / jhuacm.org, access our computing resources for any project, locally or over the internet via SSH and use our gitlab instance to host projects. Members also get J-Card access to the office, so you can come in at any time, 24/7. The ACM office is a great place to just relax or even (gasp!) work. And we have soda, coffee, snacks, and a microwave. Members can run for an executive board position in the future, and there are many opportunities to organize programs and connect with industry experts.
              </p>
            </div>

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
                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigateTo('events'); }}
                  className="contact-item"
                >
                  <FaCalendar size={20} />
                  <span>Events</span>
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