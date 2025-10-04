'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/Pages.css';
import '@/styles/HomePage.css';
import { FaCalendarAlt, FaUsers, FaHandshake, FaSignInAlt, FaInfo } from 'react-icons/fa';

const HomePage: React.FC = () => {

  return (
    <div className="home-page">
      <div className="home-layout">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">Johns Hopkins University</span>
            </div>
            
            <h1 className="hero-title">
              ACM <span className="hero-highlight">@Hopkins</span>
            </h1>
            
            <p className="hero-subtitle">
              Where Innovation Meets Opportunity
            </p>
            
            <p className="hero-description">
              Join the premier computing society at Johns Hopkins University. We're building the next generation of 
              technology leaders through collaborative learning, cutting-edge projects, and industry connections.
            </p>
            
            <div className="hero-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/about" className="secondary-cta" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <FaInfo /> <span>Learn More</span>
              </Link>
              <Link href="/signin" className="secondary-cta" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <FaSignInAlt /> <span>Sign In</span>
              </Link>
            </div>

            {/* TODO: Add actual stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Active Members</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Events Annually</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Industry Partners</span>
              </div>
            </div>

            <div className="quick-actions">
              <Link href="/booking" className="quick-action">
                <FaUsers />
                <span>Book Space</span>
              </Link>
              <Link href="/events" className="quick-action">
                <FaCalendarAlt />
                <span>View Events</span>
              </Link>
              <Link href="/sponsors" className="quick-action">
                <FaHandshake />
                <span>Our Sponsors</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
