import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file for styling

interface LoginPageProps {
  navigateTo: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password); // send this to your backend for authentication
    // Here you would typically send a request to your backend to authenticate the user
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type="password"
                id="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">LOGIN</button>
            <button
              type="button"
              className="signup-button"
              onClick={() => navigateTo('signup')}
            >
              SIGN-UP
            </button>
            <p className="forgot-password">Forgot password?</p>
          </form>
        </div>
      </div>
      <button className="home-button" onClick={() => navigateTo('home')}>Back to Home</button>
    </div>
  );
};

export default LoginPage;