import React, { useState, useEffect } from 'react';
import '../styles/NavBar.css';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";

interface NavbarProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo, error }) => {
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
        <button className="nav-links" onClick={() => navigateTo('about')}>About Us</button>
        <button className="nav-links" onClick={() => navigateTo('events')}>Events</button>
        <button className="nav-links" onClick={() => navigateTo('booking')}>Book Lounge</button>
        <button className="nav-links" onClick={() => navigateTo(isAdmin ? 'admin' : isLoggedIn ? 'profile' : 'login')}>
          {isAdmin ? 'Admin' : isLoggedIn ? 'Profile' : 'Login'}
        </button>
      </div>
  );
};

export default Navbar;