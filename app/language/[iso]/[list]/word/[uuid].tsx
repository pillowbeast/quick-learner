import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';

import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { Word, UUID } from "@/hooks/database/types";
import { useDatabase } from '@/hooks/useDatabase.tsx';
import { languageConfigs } from '@/types/languages';
import { WordProperties, PropertyType } from '@/types/word';
import WordForm from '@/components/WordForm';

export default function EditWordPage() {
  const { state } = useNavigationContext();
  const { uuid } = useLocalSearchParams<{ uuid: UUID }>();
  const { goBack } = useNavigationHelper();
  const config = languageConfigs[state.currentLanguage?.iso || 'en'] || languageConfigs.en;
  const database = useDatabase();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkmarkScale] = useState(new Animated.Value(0));
  const [wordData, setWordData] = useState<Word | null>(null);
  const [initialProperties, setInitialProperties] = useState<WordProperties>({});

  const loadWord = useCallback(async () => {
    try {
      if (!uuid) {
        setError('No word ID provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const data = await database.getWord(uuid);
      
      if (!data) {
        setError('Word not found');
        setIsLoading(false);
        return;
      }

      setWordData(data);
      
      // Load properties
      const wordProperties = await database.getWordProperties(data.uuid);
      console.log('word Properties', wordProperties);
      const formattedProperties: WordProperties = {};
      
      for (const prop of wordProperties) {
        if (prop.type === 'conjugation') {
          // For conjugation properties, parse the JSON string value
          formattedProperties[prop.name] = {
            name: prop.name,
            value: JSON.parse(prop.value),
            type: 'conjugation'
          };
        } else {
          formattedProperties[prop.name] = {
            name: prop.name,
            value: prop.value,
            type: prop.type as PropertyType
          };
        }
      }
      
      setInitialProperties(formattedProperties);
      setError(null);
    } catch (error) {
      console.error('Error loading word:', error);
      setError('Failed to load word data');
    } finally {
      setIsLoading(false);
    }
  }, [uuid, database]);

  useFocusEffect(
    useCallback(() => {
      loadWord();
    }, [loadWord])
  );

  const animateCheckmark = () => {
    Animated.sequence([
      Animated.timing(checkmarkScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(checkmarkScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  React.useEffect(() => {
    if (showSuccess) {
      animateCheckmark();
    }
  }, [showSuccess]);

  const handleSubmit = async (word: string, translation: string, example: string | undefined, properties: WordProperties) => {
    if (!wordData?.type) {
      throw new Error('Word type not found');
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await database.updateWord(
        uuid,
        word,
        translation,
        wordData.type,
        example
      );

      // Update properties
      for (const [name, property] of Object.entries(properties)) {
        const value = typeof property.value === 'object' 
          ? JSON.stringify(property.value)
          : property.value as string;

        try {
          await database.updateWordProperty(uuid, name, value);
        } catch (error) {
          // If update fails, try to add the property
          await database.addWordProperty(uuid, name, value, property.type);
        }
      }

      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating word:', error);
      throw new Error('Failed to update word');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    goBack();
  };

  if (showSuccess) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <Animated.View style={[styles.checkmark, { transform: [{ scale: checkmarkScale }] }]}>
          <IconButton
            icon="check-circle"
            size={64}
            iconColor="#10B981"
          />
        </Animated.View>
        <Text variant="headlineSmall" style={styles.successText}>Word Updated!</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleBack}
            style={styles.button}
          >
            Back
          </Button>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!wordData) {
    return null;
  }

  return (
    <WordForm
      type={wordData.type}
      config={config}
      initialWord={wordData.word}
      initialTranslation={wordData.translation}
      initialExample={wordData.example}
      initialProperties={initialProperties}
      onSubmit={handleSubmit}
      onCancel={handleBack}
      submitButtonText="Update Word"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    padding: 20,
  },
  checkmark: {
    marginBottom: 30,
  },
  successText: {
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    minWidth: 200,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 