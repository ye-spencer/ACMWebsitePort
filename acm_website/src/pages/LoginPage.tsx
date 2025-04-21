import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file for styling
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


interface LoginPageProps {
  navigateTo: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigateTo }) => {
  const [userCredentials, setUserCredentials] = useState({email: '', password: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('login');
  const [error, setError] = useState('');
  const handleCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
    console.log(userCredentials);
  };

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    // validate jhu email
    const domain = userCredentials.email.split('@')[1];
    const validDomains = ['jh.edu', 'jhu.edu', 'cs.jhu.com'];
    if (!validDomains.includes(domain)) {
      setError('Error: Invalid email domain. Please use a valid JHU email.');
      return;
    }
    // signup with email and password
    createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      // handle errors
      .catch((error) => {
        setError(error.message);
    });

  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        setError(error.message);
      });

    console.log(userCredentials);
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
                name="email"
                onChange={(e) => handleCredentials(e)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type="password"
                id="password"
                placeholder="PASSWORD"
                name="password"
                onChange={(e) => handleCredentials(e)}
                required
              />
            </div>
            <button className="login-button" onClick={(e) => handleLogin(e)}>LOGIN</button>
            <button className="signup-button" onClick={(e) => handleSignup(e)}>
              SIGN-UP
            </button>
            {
              error && (
                <div className="error-message">
                  {error}
                </div>
              )
            }
            <p className="forgot-password">Forgot password?</p>
          </form>
        </div>
      </div>
      <button className="home-button" onClick={() => navigateTo('home')}>Back to Home</button>
    </div>
  );
};

export default LoginPage;