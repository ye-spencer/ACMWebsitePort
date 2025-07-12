import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import '../styles/LoginPage.css'; // Import the CSS file for styling
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword,
         sendPasswordResetEmail,
         signInWithEmailAndPassword } from "firebase/auth";
import { useApp } from '../hooks/useApp';
import { getAllEvents, createUser, updateEvent } from '../api';

const LoginPage: React.FC = () => {
  const { user, navigateTo, error } = useApp();
  const [userCredentials, setUserCredentials] = useState({email: '', password: ''});
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
  };

  // Handle auth state changes - redirect if user is logged in
  useEffect(() => {
    if (user) {
      if (error?.includes('booking')) {
        navigateTo('booking');
      } else {
        navigateTo('home');
      }
    }
  }, [user, error, navigateTo]);

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);
    userCredentials.email = userCredentials.email.toLowerCase();

    // validate jhu email
    const domain = userCredentials.email.split('@')[1];
    const validDomains = ['jh.edu', 'jhu.edu', 'cs.jhu.com'];
    if (!validDomains.includes(domain)) {
      setLocalError('Error: Invalid email domain. Please use a valid JHU email.');
      setIsLoading(false);
      return;
    }
    // signup with email and password
    createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then(async (cred) => {
        try {
          // Get all events from API
          const events = await getAllEvents();

          // track events attended and registered
          const attended: { eventID: string; name: string; date: any }[] = [];
          const registered: { eventID: string; name: string; date: any }[] = [];
          const updatePromises: Promise<any>[] = [];

          // get events and attendees
          events.forEach((event: any) => {
            const attendees = Array.isArray(event.attendees)
              ? [...event.attendees]
              : [];
            const regs = Array.isArray(event.registered)
              ? [...event.registered]
              : [];
            let changed = false;

            // check if user is attendee
            attendees.forEach((a: any) => {
              if (a.email && a.email.toLowerCase() === cred.user.email!.toLowerCase()) {
                attended.push({ eventID: event.id, name: event.name, date: event.start });
                if (a.uid !== cred.user.uid) {
                  a.uid = cred.user.uid;
                  changed = true;
                }
              }
            });

            // check if user is registered
            regs.forEach((r: any) => {
              if (r.email && r.email.toLowerCase() === cred.user.email!.toLowerCase()) {
                registered.push({ eventID: event.id, name: event.name, date: event.start });
                if (r.uid !== cred.user.uid) {
                  r.uid = cred.user.uid;
                  changed = true;
                }
              }
            });

            // update event in database if user is attendee or registered
            if (changed) {
              updatePromises.push(updateEvent(event.id, { attendees, registered: regs }));
            }
          });

          // create user in database with events attended and registered
          await Promise.all([
            createUser(cred.user.uid, cred.user.email!, attended, registered),
            ...updatePromises,
          ]);
        } catch (err) {
          console.error('Error creating user record:', err);
        }
      })
      // handle errors
      .catch((error) => {
        setLocalError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);
    userCredentials.email = userCredentials.email.toLowerCase();

    signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then(() => {
        // Login successful
      })
      .catch((error) => {
        setLocalError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    const input = prompt("Please enter your JHU email address to reset your password:");
    if (!input) {
      setLocalError("Error: No email provided.");
      return;
    }
    const email = input.toLowerCase();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent! Please check your inbox for instructions.");
      })
      .catch((error) => {
        setLocalError(error.message);
      });
  }

  return (
    <div className="login-page page-container">
      <div className="login-container">
        <div className="login-box">
          <h1>Welcome</h1>
          <p className="login-description">Sign in or create an account with a JHU email address.</p>
          <form onSubmit={handleLogin}>
            {(error || localError) && (
              <div className="error-message">
                {error || localError}
              </div>
            )}
            <div className="input-group">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email Address"
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
                placeholder="Password"
                name="password"
                onChange={(e) => handleCredentials(e)}
                required
              />
            </div>
            <div className="button-group">
              <button 
                className="login-button" 
                onClick={(e) => handleLogin(e)}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
              <button 
                className="signup-button" 
                onClick={(e) => handleSignup(e)}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            <p onClick={handlePasswordReset} className="forgot-password">
              Forgot your password?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;