import React from 'react';

interface HomePageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo, error }) => {

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8" style={{ position: 'relative', zIndex: 1 }}>
      <div className="about-background" style={{ zIndex: -1 }}></div>      
      {error && (
        <div className="error-message" style={{ position: 'relative', zIndex: 2 }}>
          {error}
        </div>
      )}
      
      <h1 className="text-4xl font-bold mb-4 text-gray-800" style={{ position: 'relative', zIndex: 2, color: 'white' }}>Welcome to JHU ACM</h1>
      <p className="text-xl mb-8 text-gray-600" style={{ position: 'relative', zIndex: 2, color: 'white' }}>Association for Computing Machinery</p>
    </div>
  );
};

export default HomePage;