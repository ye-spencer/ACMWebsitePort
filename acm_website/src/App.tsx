import React, { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import CreditsPage from './pages/CreditsPage';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [error, setError] = useState('');

  const navigateTo = (page: string, errorMessage?: string) => {
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError('');
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} error={error} />;
      case 'about':
        return <AboutPage navigateTo={navigateTo} error={error} />;
      case 'events':
        return <EventsPage navigateTo={navigateTo} error={error} />;
      case 'credits':
        return <CreditsPage navigateTo={navigateTo} error={error} />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} error={error} />;
      case 'booking':
        return <BookingPage navigateTo={navigateTo} error={error} />;
      case 'profile':
        return <ProfilePage navigateTo={navigateTo} error={error} />;
      case 'admin':
        return <AdminPage navigateTo={navigateTo} error={error} />;
      default:
        return <HomePage navigateTo={navigateTo} error={error} />;
    }
  };

  return <div className="App">
    <div className="background-image" style={{ zIndex: -1 }}></div>
    <Navbar navigateTo={navigateTo} />
    {renderPage()}
    <div className="credits">
      made with lots of ❤️ @jhu acm
    </div> 
  </div>;
}

export default App;
