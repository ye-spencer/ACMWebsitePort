import React, { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import CreditsPage from './pages/CreditsPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'about':
        return <AboutPage navigateTo={navigateTo} />;
      case 'events':
        return <EventsPage navigateTo={navigateTo} />;
      case 'credits':
        return <CreditsPage navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;
