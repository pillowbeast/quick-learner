import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, Button, FAB, ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useDatabase } from '@/hooks/useDatabase';
import Flag from '@/components/Flag';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigationContext, Language } from '@/hooks/useNavigationContext';
import i18n from '@/i18n';

export default function LanguageSelector() {
  const theme = useTheme();
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
      const languages = await database.getAllLanguages();
      setUserLanguages(languages);
    } catch (error) {
      console.error('Error loading languages:', error);
    } finally {
      isLoading.current = false;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!database.isLoading) {
        loadLanguages();
      }
    }, [database])
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
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{i18n.t('loading_database')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {userLanguages.map((language) => (
          <Surface 
            key={language.uuid} 
            style={[styles.card, { backgroundColor: theme.colors.surface }]} 
            elevation={1}
          >
            <Flag iso={language.iso} />
            <Text style={styles.name}>{language.name}</Text>
            <Button
              mode="contained"
              onPress={() => handleLanguageSelect(language)}
              style={styles.button}
            >
              {i18n.t('learn')}
            </Button>
          </Surface>
        ))}
        <Surface 
          style={[styles.addCard, { backgroundColor: theme.colors.surface }]} 
          elevation={1}
        >
          <FAB
            icon="plus"
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            onPress={goToAddLanguage}
            onLongPress={showDevMenu}
          />
          <Text style={styles.addText}>{i18n.t('add_language')}</Text>
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  card: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addCard: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
  },
  fab: {
    marginBottom: 8,
  },
  addText: {
    fontSize: 14,
    opacity: 0.7,
  },
});