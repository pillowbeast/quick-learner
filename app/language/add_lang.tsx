import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Surface, Button, ActivityIndicator, IconButton } from 'react-native-paper';

import { useNavigationHelper } from '@/hooks/useNavigation';
import { useDatabase } from '@/hooks/useDatabase.tsx';
import { Language } from '@/hooks/useNavigationContext';

import Flag from '@/components/Flag';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import UnifiedHeader from '@/components/UnifiedHeader';
import UnifiedFooter from '@/components/UnifiedFooter';

import { WordType } from '@/types/word';
import { languageConfigs } from '@/types/languages';

import i18n from '@/i18n';
import { entryStyles } from '@/styles/entryStyles';
import { useAppTheme } from '@/styles/ThemeContext';
import { typography } from '@/styles/tokens';
import UnifiedSeperator from '@/components/UnifiedSeperator';

interface InitialWord {
  word: string;
  translation: string;
  type: WordType;
  example?: string;
}

interface LanguageConfigWithInitialWords {
  initialWords?: InitialWord[];
}

export default function AddLanguagePage() {
  const { goHomeReplace } = useNavigationHelper();
  const database = useDatabase();
  const { colors } = useAppTheme();

  const [existingLanguages, setExistingLanguages] = useState<Language[]>([]);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setIsLoading(true);
        const languages = await database.getAllLanguages();
        setExistingLanguages(languages);
      } catch (error) {
        console.error('Error loading languages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!database.isLoading) {
      loadLanguages();
    }
  }, [database.isLoading]);

  const handleAddLanguage = async (iso: string, name: string) => {
    setIsAdding(iso);
    try {
      // Add the language
      const result = await database.addLanguage(iso, name);
      if (!result) {
        throw new Error('Failed to add language');
      }

      // Create a standard list
      const list = await database.addList(result.iso, i18n.t('default_list'), i18n.t('default_list_description'));

      // Get initial words from the language config
      const languageConfig = languageConfigs[iso] as LanguageConfigWithInitialWords;
      console.log('Language config:', languageConfig);
      const initialWords = languageConfig?.initialWords || [];
      console.log('Initial words:', initialWords);

      if (initialWords.length > 0) {
        // Add each word to the database
        for (const word of initialWords) {
          await database.addWord(
            list.uuid,
            word.word,
            word.translation,
            word.type,
            word.example
          );
        }
      }

      goHomeReplace();
    } catch (error) {
      console.error('Error adding language:', error);
    } finally {
      setIsAdding(null);
    }
  };

  // Get available languages from languageConfigs
  const availableLanguages = Object.entries(languageConfigs).map(([iso, config]) => ({
    iso,
    name: config.name
  }));

  if (database.isLoading || isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{i18n.t('loading_languages')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      <UnifiedHeader
        title={i18n.t('add_language')}
        backButton={true}
        actions={
          <></> } />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {availableLanguages.map((language, index) => {
          const isAdded = existingLanguages.some(existing => existing.iso === language.iso);
          const isLastItem = index === availableLanguages.length - 1;
          return (
            <View key={language.iso}>
              <Surface
                key={language.iso}
                style={[entryStyles.card, { opacity: isAdded ? 0.7 : 1, backgroundColor: colors.background }]}
                elevation={0}
              >
                { !isAdded ? (
                  <TouchableOpacity onPress={() => handleAddLanguage(language.iso, language.name)} style={{width: '100%'}}>
                  <View style={entryStyles.cardContent}>
                    <View style={entryStyles.infoContainer}>
                      <Flag iso={language.iso} />
                      <View style={entryStyles.textContainer}>
                        <Text style={[typography.subheader, { color: colors.text }]}>{language.name}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                ) : (
                  <View style={entryStyles.cardContent}>
                    <View style={entryStyles.infoContainer}>
                      <Flag iso={language.iso} />
                      <View style={entryStyles.textContainer}>
                        <Text style={[typography.subheader, { color: colors.muted }]}>{language.name}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </Surface>
              {!isLastItem && <UnifiedSeperator />}
            </View>
          );
        })}
      </ScrollView>
      <UnifiedFooter />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  name: {
    fontSize: 16,
  },
  button: {
    marginLeft: 16,
  },
}); 