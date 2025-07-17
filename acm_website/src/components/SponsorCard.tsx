import React from 'react';
import '../styles/SponsorsPage.css';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface Sponsor {
    name: string;
    logoPath: string;
    description: string;
    tier: 'Partner' | 'Standard';
    website: string;
    year: string;
}

interface SponsorCardProps {
    sponsor: Sponsor;
    className: string;
    placeholderLogo: string;
    textColor?: string;
}

const SponsorCard: React.FC<SponsorCardProps> = ({
    sponsor,
    className,
    placeholderLogo,
    textColor
}) => {
    return (
        <div className={`sponsor-card ${className}`}>
            <div className="sponsor-logo">
                <img
                    src={sponsor.logoPath || placeholderLogo}
                    alt={`${sponsor.name} logo`}
                    onError={(e) => { e.currentTarget.src = placeholderLogo; }}
                />
            </div>
            <div className="sponsor-info">
                <h4 className="sponsor-name" style={{ color: textColor}}>{sponsor.name}</h4>
                <p className="sponsor-description" style={{ color: textColor}}>{sponsor.description}</p>
                <div className="sponsor-meta">
                <span className="sponsor-year" style={{ color: textColor}}>{sponsor.year}</span>
                <a href={sponsor.website} className="sponsor-link" style={{ color: textColor}} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt size={14} />
                    <span>Visit Website</span>
                </a>
                </div>
            </div>
        </div>
    );
};

export default SponsorCard;