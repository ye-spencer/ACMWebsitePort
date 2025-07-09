import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';

interface HomePageProps {
  error?: string;
}

const HomePage: React.FC<HomePageProps> = ({ error }) => {
  const [showHero, setShowHero] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleArrowClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setAnimationKey(prev => prev + 1);
    setShowHero(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;

      // Scrolling down on welcome screen
      if (!showHero && e.deltaY > 0) {
        e.preventDefault();
        setIsTransitioning(true);
        setAnimationKey(prev => prev + 1);
        setShowHero(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2000);
      }
      // Scrolling up on hero screen
      else if (showHero && e.deltaY < 0) {
        e.preventDefault();
        setIsTransitioning(true);
        setAnimationKey(prev => prev + 1);
        setShowHero(false);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      }
    };

    // Add wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [showHero, isTransitioning]);

  return (
    <div className="relative w-full">
      {/* Initial Welcome Section - Only show when hero is not visible */}
      {!showHero && (
        <div 
          key={`welcome-${animationKey}`}
          className={`flex flex-col items-center justify-center min-h-[100vh] p-8 relative ${animationKey > 0 ? 'fade-in-down' : ''}`} 
          style={{ position: 'relative', zIndex: 1 }}
        >
          {error && (
            <div className="error-message" style={{ position: 'relative', zIndex: 2 }}>
              {error}
            </div>
          )}
          
          <div className="welcome-section text-center" style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="text-5xl font-bold mb-4 text-white">Welcome to ACM@Hopkins</h1>
            <p className="text-lg text-white opacity-90">The Johns Hopkins University Student Chapter of the Association for Computing Machinery</p>
          </div>

          {/* Arrow Button - Fixed positioning */}
          <div 
            style={{ 
              position: 'fixed',
              bottom: '10vh',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10
            }}
          >
            <div
              style={{
                opacity: animationKey > 0 ? 0 : 1,
                animation: animationKey > 0 ? 'fade-in-up 1s ease-out forwards' : ''
              }}
            >
              <button
                onClick={handleArrowClick}
                className={`arrow-button transition-all duration-300 hover:scale-110 ${animationKey === 0 ? 'animate-bounce' : ''}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid white',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                >
                  <path d="M7 10l5 5 5-5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Slides in when arrow is clicked */}
      {showHero && (
        <div 
          key={`hero-${animationKey}`}
          id="hero-section"
          className="hero-section-container fade-in-up"
        >
          <div className="hero-content">
            <div className="hero-inner">
              <h2 className="hero-title">
                Your Journey in Computing Starts Here!
              </h2>
              <p className="hero-description">
                At ACM Hopkins, we inspire and equip students to explore the frontiers of computing. Whether you're a seasoned programmer or just starting your journey, our community fosters collaboration, innovation, and growth.
              </p>

              {/* Additional content section */}
              <div className="max-w-3xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div 
                    className="text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">Connect</h4>
                    <p className="text-white opacity-90">Network with peers and industry leaders.</p>
                  </div>
                  <div 
                    className="text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">Learn</h4>
                    <p className="text-white opacity-90">Attend workshops, seminars, and coding challenges.</p>
                  </div>
                  <div 
                    className="text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">Create</h4>
                    <p className="text-white opacity-90">Work on exciting projects and hackathons that make a difference.</p>
                  </div>
                </div>

                <div className="cta-container">
                  <span className="cta-text">Get Involved</span>
                  <button
                    className="cta-button"
                    onClick={() => window.open('/login')}
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="cta-arrow"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;