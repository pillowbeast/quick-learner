import React, { createContext, useContext, useState } from 'react';
import { Language as DbLanguage, List as DbList } from './database/types';

export interface Language extends DbLanguage {
  lists?: DbList[];
}

interface NavigationState {
  currentLanguage?: Language;
  currentList?: DbList;
}

interface NavigationContextType {
  state: NavigationState;
  setCurrentLanguage: (language: Language) => void;
  setCurrentList: (list: DbList) => void;
  clearState: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationState>({});

  const setCurrentLanguage = (language: Language) => {
    setState(prev => ({
      ...prev,
      currentLanguage: language
    }));
  };

  const setCurrentList = (list: DbList) => {
    setState(prev => ({
      ...prev,
      currentList: list
    }));
  };

  const clearState = () => {
    setState({});
  };

  return (
    <NavigationContext.Provider value={{ state, setCurrentLanguage, setCurrentList, clearState }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
} 