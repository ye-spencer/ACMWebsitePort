import React from 'react';
import { Person } from '@/types/types';

interface FlipCardProps {
  data: Person[];
}

const FlipCard: React.FC<FlipCardProps> = ({ data }) => {
  return (
    <div className="flip-card-grid">
      {data.map((person, index) => (
        <div key={index} className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img
                src={
                  // Use image if present, else imagePath if present, else fallback
                  (person as any).image ||
                  (person as any).imagePath ||
                  "/placeholder-alumni.svg"
                }
                alt={person.name}
                className="flip-card-image"
              />
              <h3 className="flip-card-name">{person.name}</h3>
              {/* Show position if present, else year/company if present */}
              {"position" in person && (person as any).position ? (
                <p className="flip-card-position">{(person as any).position}</p>
              ) : (
                <>
                  {"year" in person && (person as any).year && (
                    <p className="flip-card-position">{(person as any).year}</p>
                  )}
                  {"company" in person && (person as any).company && (
                    <p className="flip-card-company">{(person as any).company}</p>
                  )}
                </>
              )}
            </div>
            <div className="flip-card-back">
              <h3 className="flip-card-name">{person.name}</h3>
              {/* Show position if present, else year/company if present */}
              {"position" in person && (person as any).position ? (
                <p className="flip-card-position">{(person as any).position}</p>
              ) : (
                <>
                  {"year" in person && (person as any).year && (
                    <p className="flip-card-position">{(person as any).year}</p>
                  )}
                  {"company" in person && (person as any).company && (
                    <p className="flip-card-company">{(person as any).company}</p>
                  )}
                </>
              )}
              {/* Show bio if present, else LinkedIn if present */}
              {"bio" in person && (person as any).bio ? (
                <p className="flip-card-bio">{(person as any).bio}</p>
              ) : (
                <>
                  {"linkedin" in person && (person as any).linkedin && (
                    <a
                      href={(person as any).linkedin}
                      className="flip-card-linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View LinkedIn
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlipCard;
