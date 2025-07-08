import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsAdmin(user?.email === "jhuacmweb@gmail.com");
    });
  }, []);

  return (
      <div className="navbar">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="ACM Logo" className="logo" />
        </Link>
        <div className="nav-links-container">
          <Link to="/" className="nav-links">Home</Link>
          <Link to="/about" className="nav-links">About Us</Link>
          <Link to="/events" className="nav-links">Events</Link>
          <Link to="/booking" className="nav-links">Book Lounge</Link>
          <Link to={isAdmin ? '/admin' : isLoggedIn ? '/profile' : '/login'} className="nav-links">
            {isAdmin ? 'Admin' : isLoggedIn ? 'Profile' : 'Login'}
          </Link>
        </div>
      </div>
  );
};

export default Navbar;