import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import { useApp } from '../hooks/useApp';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const { isLoggedIn, isAdmin, navigateTo } = useApp();

  return (
      <div className="navbar">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="ACM Logo" className="logo" />
        </Link>
        <div className="nav-links-container">
          <Link to="#" onClick={(e) => { e.preventDefault(); navigateTo('home', '') }} className="nav-links">Home</Link>
          <Link to="#" onClick={(e) => { e.preventDefault(); navigateTo('about', '') }} className="nav-links">About Us</Link>
          <Link to="#" onClick={(e) => { e.preventDefault(); navigateTo('events', '') }} className="nav-links">Events</Link>
          <Link to="#" onClick={(e) => { e.preventDefault(); navigateTo('sponsors', '') }} className="nav-links">Sponsors</Link>
          <Link to="#" onClick={(e) => { e.preventDefault(); navigateTo('booking', '') }} className="nav-links">Book Lounge</Link>
          <Link 
            to="#"
            onClick={(e) => { e.preventDefault(); navigateTo(isAdmin ? 'admin' : isLoggedIn ? 'profile' : 'login', '') }} 
            className="nav-links"
          >
            {isAdmin ? 'Admin' : isLoggedIn ? 'Profile' : 'Login'}
          </Link>
        </div>
      </div>
  );
};

export default Navbar;