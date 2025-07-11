import React, { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface AppContextType {
  // Auth state
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  
  // Error state
  error: string;
  setError: (error: string) => void;
  clearError: () => void;
  
  // Navigation
  navigateTo: (page: string, errorMessage?: string) => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoggedIn(!!user);
      setIsAdmin(user?.email === "jhuacmweb@gmail.com");
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const navigateTo = useCallback((page: string, errorMessage?: string) => {
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError('');
    }
    navigate(`/${page === 'home' ? '' : page}`);
  }, [navigate, setError]);

  const clearError = () => {
    setError('');
  };

  const value: AppContextType = {
    // Auth state
    user,
    isLoggedIn,
    isAdmin,
    authLoading,
    
    // Error state
    error,
    setError,
    clearError,
    
    // Navigation
    navigateTo,
    
    // Loading state
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;