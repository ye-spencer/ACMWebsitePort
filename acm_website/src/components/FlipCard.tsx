import React, { useState } from 'react';
import placeholderImage from '../assets/depositphotos_104564156-stock-illustration-male-user-icon.jpg';
import '../styles/FlipCard.css';

interface MemberData {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  imagePath?: string;
}

interface FlipCardProps {
  data: MemberData[];
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ data, className = 'members-grid' }) => {
  // State to track which cards are flipped
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Toggle flip state for a card
  const toggleFlip = (index: number) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter(i => i !== index));
    } else {
      setFlippedCards([...flippedCards, index]);
    }
  };

  return (
    <div className={className}>
      {data.map((member, index) => (
        <div 
          key={index} 
          className={`flip-card ${flippedCards.includes(index) ? 'flipped' : ''}`}
          onClick={() => toggleFlip(index)}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img 
                src={member.imagePath || placeholderImage} 
                alt={`${member.name}`} 
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
            <div className="flip-card-back">
              <h3 className="member-name">{member.name}</h3>
              <h4 className="member-role">{member.role}</h4>
              <p className="member-bio">{member.bio}</p>
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="member-linkedin"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlipCard; 