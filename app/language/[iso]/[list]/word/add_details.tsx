import React, { useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { WordType } from '@/types/word';
import { languageConfigs } from '@/types/languages';
import { useDatabase } from '@/hooks/useDatabase.tsx';
import WordForm from '@/components/WordForm';

export default function WordDetailsPage() {
  const { goToAddWordType, goBack } = useNavigationHelper();
  const { state } = useNavigationContext();
  const { type } = useLocalSearchParams<{ type: WordType }>();
  const config = languageConfigs[state.currentLanguage?.iso || 'en'] || languageConfigs.en;
  const database = useDatabase();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkmarkScale] = useState(new Animated.Value(0));

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

  const handleSubmit = async (word: string, translation: string, example: string | undefined, properties: Record<string, any>) => {
    if (!state.currentList?.uuid) {
      throw new Error('No current list selected');
    }

    const result = await database.addWord(
      state.currentList.uuid,
      word,
      translation,
      type,
      example
    );

    if (result) {
      // Add all properties from the config
      for (const [name, property] of Object.entries(properties)) {
        const value = typeof property.value === 'object' 
          ? JSON.stringify(property.value)
          : property.value as string;

        await database.addWordProperty(
          result.uuid, 
          name, 
          value,
          property.type
        );
      }
      setShowSuccess(true);
    } else {
      throw new Error('Failed to add word');
    }
  };

  const handleAddAnother = () => {
    goToAddWordType();
  };

  const handleBackToList = () => {
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
        <Text variant="headlineSmall" style={styles.successText}>Word Added!</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleAddAnother}
            style={styles.button}
          >
            Add Another
          </Button>
          <Button
            mode="outlined"
            onPress={handleBackToList}
            style={styles.button}
          >
            Back to List
          </Button>
        </View>
      </View>
    );
  }

  return (
    <WordForm
      type={type}
      config={config}
      onSubmit={handleSubmit}
      submitButtonText="Add Word"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 