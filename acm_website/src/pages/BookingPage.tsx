import React from 'react';
import './LoginPage.css'; // Reuse the login page styling
import { auth } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";

interface BookingPageProps {
  navigateTo: (page: string, errorMessage?: string) => void;
  error?: string;
}

<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>

const BookingPage: React.FC<BookingPageProps> = ({ navigateTo, error }) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //yayay
    } else {
      navigateTo('login', 'Please log in to access the booking page');
    }
  });
  return (
    <div className="login-page">
      <div className="about-background" style={{ zIndex: -1 }}></div>
      <div className="login-container">
        <div className="login-box">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="calendly-inline-widget" data-url="https://calendly.com/jhuacmweb"></div>
          <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
        </div>
      </div>
      <button className="home-button" onClick={() => navigateTo('home')}>Back to Home</button>
    </div>
  );
};

export default BookingPage; 