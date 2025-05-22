import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language as DbLanguage, List as DbList } from './database/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';
import { View } from 'react-native';

export interface Language extends DbLanguage {
  lists?: DbList[];
}

interface NavigationState {
  currentLanguage?: Language;
  currentList?: DbList;
  displayLanguage: string;
}

interface NavigationContextType {
  state: NavigationState;
  setCurrentLanguage: (language: Language) => void;
  setCurrentList: (list: DbList) => void;
  setDisplayLanguage: (language: string) => void;
  clearState: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const DISPLAY_LANGUAGE_KEY = '@quick_learner_display_language';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    displayLanguage: 'en' // Default to English
  });

  // Load display language preference on startup
  useEffect(() => {
    const loadDisplayLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(DISPLAY_LANGUAGE_KEY);
        if (savedLanguage) {
          setState(prev => ({
            ...prev,
            displayLanguage: savedLanguage
          }));
          i18n.locale = savedLanguage;
        }
      } catch (error) {
        console.error('Error loading display language preference:', error);
      }
    };
    loadDisplayLanguage();
  }, []);

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

  const setDisplayLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem(DISPLAY_LANGUAGE_KEY, language);
      setState(prev => ({
        ...prev,
        displayLanguage: language
      }));
      i18n.locale = language;
    } catch (error) {
      console.error('Error saving display language preference:', error);
    }
  };

  const clearState = () => {
    setState({ displayLanguage: 'en' });
    i18n.locale = 'en';
  };

  return (
    <View style={{ flex: 1 }}>
      <NavigationContext.Provider value={{ state, setCurrentLanguage, setCurrentList, setDisplayLanguage, clearState }}>
        {children}
      </NavigationContext.Provider>
    </View>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
} 