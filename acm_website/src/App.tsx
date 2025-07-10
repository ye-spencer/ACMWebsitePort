import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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

function AppContent() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const navigateTo = (page: string, errorMessage?: string) => {
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError('');
    }
    navigate(`/${page === 'home' ? '' : page}`);
  };

  return (
    <div className="App">
      <div className="background-image" style={{ zIndex: -1 }}></div>
      <Navbar navigateTo={navigateTo} />
      <Routes>
        <Route path="/" element={<HomePage error={error} />} />
        <Route path="/about" element={<AboutPage navigateTo={navigateTo} error={error} />} />
        <Route path="/events" element={<EventsPage navigateTo={navigateTo} error={error} />} />
        <Route path="/credits" element={<CreditsPage navigateTo={navigateTo} error={error} />} />
        <Route path="/login" element={<LoginPage navigateTo={navigateTo} error={error} />} />
        <Route path="/booking" element={<BookingPage navigateTo={navigateTo} error={error} />} />
        <Route path="/profile" element={<ProfilePage navigateTo={navigateTo} error={error} />} />
        <Route path="/admin" element={<AdminPage navigateTo={navigateTo} error={error} />} />
      </Routes>
      <div className="credits" onClick={() => navigateTo('credits')}>
        made with lots of ❤️ by acm@hopkins
      </div> 
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
