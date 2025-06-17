import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, FAB, ActivityIndicator, IconButton } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useDatabase } from '@/hooks/useDatabase';
import Flag from '@/components/Flag';
import { useFocusEffect } from '@react-navigation/native';

import { useNavigationContext, Language } from '@/hooks/useNavigationContext';
import i18n from '@/i18n';
import { typography, spacing, radii } from '@/styles/tokens';
import { logger } from '@/utils/logger';
import { useAppTheme } from '@/styles/ThemeContext';
import { entryStyles } from "@/styles/entryStyles";
import UnifiedAddButton from '@/components/UnifiedAddButton';
import UnifiedSeperator from '@/components/UnifiedSeperator';

export default function LanguageSelector() {
  const { colors, theme } = useAppTheme();
  const { goToLanguage, goToAddLanguage } = useNavigationHelper();
  const { setCurrentLanguage } = useNavigationContext();
  const database = useDatabase();
  const [userLanguages, setUserLanguages] = useState<Language[]>([]);
  const lastLoadTime = useRef<number>(0);
  const isLoading = useRef<boolean>(false);

  const loadLanguages = async () => {
    // Prevent multiple rapid calls
    const now = Date.now();
    if (now - lastLoadTime.current < 100 || isLoading.current) {
      return;
    }

    try {
      isLoading.current = true;
      lastLoadTime.current = now;
      
      // Ensure database is initialized
      if (!database.isInitialized) {
        logger.info("Waiting for database initialization...");
        return;
      }

      const languages = await database.getAllLanguages();
      setUserLanguages(languages);
    } catch (error: any) {
      console.error('Error loading languages:', error);
      // If we get a database error, we might need to wait for initialization
      if (error?.message?.includes('database')) {
        logger.info("Database not ready, will retry on next focus");
      }
    } finally {
      isLoading.current = false;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!database.isLoading) {
        loadLanguages();
      }
    }, [database.isLoading, database.isInitialized])
  );

  const handleLanguageSelect = (language: Language) => {
    setCurrentLanguage(language);
    goToLanguage(language);
  };

  // DEVELOPMENT ONLY
  const showDevMenu = () => {
    Alert.alert(
      'Developer Menu',
      'What would you like to do?',
      [
        {
          text: 'Reset Database',
          onPress: async () => {
            await database.reset();
            await loadLanguages(); // Reload languages after reset
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  if (database.isLoading) {
    return (
      <View style={[entryStyles.loadingContainer]}>
        <ActivityIndicator size="large" />
        <Text style={[typography.caption]}>{i18n.t('loading_database')}</Text>
      </View>
    );
  }

  return (
    <View style={entryStyles.container}>
      {userLanguages.map((language) => (
        <View
          key={language.uuid}
        >
          <Surface
            style={[entryStyles.card, { backgroundColor: colors.background } ]}
            elevation={0}
          >
            <TouchableOpacity onPress={() => handleLanguageSelect(language)} style={{width: '100%'}}>
              <View style={entryStyles.cardContent}>
                <View style={entryStyles.infoContainer}>
                  <Flag iso={language.iso} />
                  <View style={entryStyles.textContainer}>
                    <Text style={[typography.subheader, { color: colors.text }]}>{language.name}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Surface>
          <UnifiedSeperator />
        </View>
      ))}
      <UnifiedAddButton onPress={goToAddLanguage} onLongPress={showDevMenu} />
    </View>
  );
}

const styles = StyleSheet.create({

});