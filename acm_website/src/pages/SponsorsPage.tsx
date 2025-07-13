import React from 'react';
import { sponsorsData } from '../data/sponsors';
import '../styles/SponsorsPage.css';
import { useApp } from '../hooks/useApp';
import { FaUsers, FaExternalLinkAlt } from 'react-icons/fa';

const SponsorsPage: React.FC = () => {
    const { error } = useApp();

    const partners = sponsorsData.filter(sponsor => sponsor.tier == 'Partner');
    const standard = sponsorsData.filter(sponsor => sponsor.tier == 'Standard');

    return (
        <div className="sponsors-page">
            <div className="sponsors-layout">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">Our Sponsors</h1>
                    <p className="page-subtitle">Supporting innovation and excellence in Computer Science education</p>
                </div>

                {error && (
                    <div className="sponsors-section error-section">
                        <div className="error-message">{error}</div>
                    </div>
                )}

                {/* Sponsorship Benefits Section */}
                <div className="sponsors-section">
                    <h2 className="section-title">Why Sponsor ACM @ Hopkins?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FaUsers size={24} />
                            </div>
                            <h3 className="benefit-title">Access to Top Talent</h3>
                            <p className="benefit-description">
                                Connect with exceptional Computer Science students from one of the nation's leading universities.
                            </p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FaUsers size={24} />
                            </div>
                            <h3 className="benefit-title">Innovation Hub</h3>
                            <p className="benefit-description">
                                Partner with students working on cutting-edge projects and research-initiatives.
                            </p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FaUsers size={24} />
                            </div>
                            <h3 className="benefit-title">Brand Visibility</h3>
                            <p className="benefit-description">
                                Showcase your company at events, workshops and networking opportunities.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current Sponsors Section */}
                <div className="sponsors-section">
                    <h2 className="section-title">Current Sponsors</h2>

                    <div className="sponsor-tier-group">
                        <h3 className="tier-group-title">Partners</h3>
                        <div className="sponsors-grid">
                            {partners.map((sponsor) => (
                                <div key={sponsor.name} className="sponsor-card partner">
                                    <div className="sponsor-logo">
                                        {sponsor.logoPath ? (
                                            <img src={sponsor.logoPath} alt={`${sponsor.name} logo`} />
                                        ) : (
                                            <div className="sponsor-placeholder">{sponsor.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="sponsor-info">
                                        <h4 className="sponsor-name">{sponsor.name}</h4>
                                        <p className="sponsor-description">{sponsor.description}</p>
                                        <div className="sponsor-meta">
                                            <span className="sponsor-year">{sponsor.year}</span>
                                            <a href={sponsor.website} className="sponsor-link">
                                                <FaExternalLinkAlt size={14} />
                                                <span>Visit Website</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sponsor-tier-group">
                        <h3 className="tier-group-title">Standard Sponsors</h3>
                        <div className="sponsors-grid">
                            {standard.map((sponsor) => (
                                <div key={sponsor.name} className="sponsor-card standard">
                                    <div className="sponsor-logo">
                                        {sponsor.logoPath ? (
                                            <img src={sponsor.logoPath} alt={`${sponsor.name} logo`} />
                                        ) : (
                                            <div className="sponsor-placeholder">{sponsor.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="sponsor-info">
                                        <h4 className="sponsor-name">{sponsor.name}</h4>
                                        <p className="sponsor-description" style={{ color: '#003366' }}>{sponsor.description}</p>
                                        <div className="sponsor-meta">
                                            <span className="sponsor-year" style={{ color: '#003366' }}>{sponsor.year}</span>
                                            <a href={sponsor.website} className="sponsor-link" style={{ color: '#003366' }}>
                                                <FaExternalLinkAlt size={14} />
                                                <span>Visit Website</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="sponsors-section">
                    <h2 className="section-title">Interested in Sponsoring?</h2>
                    <div className="contact-content">
                        <p className="contact-description">
                            We're always looking for new partners to support our mission of advancing 
                            Computer Science education and fostering innovation at Johns Hopkins 
                            University. Contact us to learn more about sponsorship opportunities.
                        </p>
                        <div className="contact-links">
                            <a href="mailto:jhuacmofficers@gmail.com" className="contact-item">
                                <FaExternalLinkAlt size={28} />
                                <span>jhuacmofficers@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SponsorsPage;