import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";
import logo from '../assets/logo.png';

interface NavbarProps {
  navigateTo: (page: string, errorMessage?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsAdmin(user?.email === "jhuacmweb@gmail.com");
    });
    return unsubscribe;
  }, []);

  return (
      <div className="navbar">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="ACM Logo" className="logo" />
        </Link>
        <div className="nav-links-container">
          <Link to="#" onClick={(e) => { e.preventDefault(); navigateTo('home', '') }} className="nav-links">Home</Link>
          <Link to="#" onClick={(e) => { e.preventDefault(); navigateTo('about', '') }} className="nav-links">About Us</Link>
          <Link to="#" onClick={(e) => { e.preventDefault(); navigateTo('events', '') }} className="nav-links">Events</Link>
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