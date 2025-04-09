import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from './translations';

// Create a properly typed i18n instance
const i18n = new I18n(translations);

// Set default language
i18n.locale = 'en';

// Available languages with their display names
export const availableLanguages = {
    en: { name: 'English', nativeName: 'English' },
    de: { name: 'German', nativeName: 'Deutsch' },
};

// Get display language info
export const getDisplayLanguage = (iso: string) => {
    return availableLanguages[iso as keyof typeof availableLanguages] || availableLanguages.en;
};

// Initialize language from AsyncStorage
export const initializeLanguage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem('displayLanguage');
        if (savedLanguage) {
            i18n.locale = savedLanguage;
        }
    } catch (error) {
        console.error('Error loading language from AsyncStorage:', error);
    }
};

// Set language and save to AsyncStorage
export const setLanguage = async (locale: string) => {
    try {
        i18n.locale = locale;
        await AsyncStorage.setItem('displayLanguage', locale);
    } catch (error) {
        console.error('Error saving language to AsyncStorage:', error);
    }
};

export default i18n;
