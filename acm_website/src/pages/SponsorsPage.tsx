import React from 'react';
import '../styles/SponsorsPage.css';
import { sponsorsData } from '../data/sponsors';
import { FaUsers, FaLightbulb, FaHandshake, FaEnvelope } from 'react-icons/fa';
import placeholderLogo from '../assets/placeholder logo.png';
import SponsorCard from '../components/SponsorCard';
import { useApp } from '../hooks/useApp';

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
                                <FaLightbulb size={24} />
                            </div>
                            <h3 className="benefit-title">Innovation Hub</h3>
                            <p className="benefit-description">
                                Partner with students working on cutting-edge projects and research-initiatives.
                            </p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FaHandshake size={24} />
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
                                <SponsorCard
                                    key={sponsor.name}
                                    sponsor={sponsor}
                                    className="partner"
                                    placeholderLogo={placeholderLogo}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="sponsor-tier-group">
                        <h3 className="tier-group-title">Standard Sponsors</h3>
                        <div className="sponsors-grid">
                            {standard.map((sponsor) => (
                                <SponsorCard
                                    key={sponsor.name}
                                    sponsor={sponsor}
                                    className="standard"
                                    placeholderLogo={placeholderLogo}
                                    textColor="#003366"
                                />
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
                                <FaEnvelope size={28} />
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