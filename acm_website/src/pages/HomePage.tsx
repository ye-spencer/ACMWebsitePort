import React from 'react';

interface HomePageProps {
  navigateTo: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to ACM</h1>
      <p className="text-xl mb-8 text-gray-600">Association for Computing Machinery</p>
      <div className="flex gap-4">
        <button 
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          onClick={() => navigateTo('about')}
        >
          About Us
        </button>
        <button 
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          onClick={() => navigateTo('events')}
        >
          Events
        </button>
      </div>
    </div>
  );
};

export default HomePage; 