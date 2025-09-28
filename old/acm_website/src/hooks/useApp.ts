import { useContext } from 'react';
import AppContext, { AppContextType } from '../contexts/AppContext';

// Custom hook for using the app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 