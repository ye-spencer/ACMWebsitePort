import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider } from './contexts/AppContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import CreditsPage from './pages/CreditsPage';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import SponsorsPage from './pages/SponsorsPage';
import Navbar from './components/Navbar';
import { useApp } from './hooks/useApp';

function AppContent() {
  const { navigateTo } = useApp();
  return (
    <div className="App">
      <div className="background-image" style={{ zIndex: -1 }}></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
      </Routes>
      <a className="credits" href="#" onClick={(e) => {e.preventDefault(); navigateTo('credits')}}>
        made with lots of ❤️ by acm@hopkins
      </a> 
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;
