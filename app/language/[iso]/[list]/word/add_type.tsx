import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';

import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { languageConfigs } from '@/types/languages';

export default function AddWordTypePage() {
  const { state } = useNavigationContext();
  const { goToAddWordDetails } = useNavigationHelper();
  const config = languageConfigs[state.currentLanguage?.iso || 'en'] || languageConfigs.en;

  const handleTypeSelect = (type: string) => {
    goToAddWordDetails(type);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={1}>
        <Text variant="headlineSmall" style={styles.title}>
          Select Word Type
        </Text>
      </Surface>

      <ScrollView style={styles.content}>
        {config.wordTypes.map((wordType) => (
          <Surface
            key={wordType.type}
            style={styles.typeCard}
            elevation={1}
            onTouchEnd={() => handleTypeSelect(wordType.type)}
          >
            <IconButton
              icon={wordType.icon}
              size={32}
              style={styles.typeIcon}
            />
            <View style={styles.textContainer}>
              <Text variant="titleMedium" style={styles.typeText}>
                {wordType.text}
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {wordType.description}
              </Text>
            </View>
          </Surface>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  typeIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  typeText: {
    fontWeight: 'bold',
  },
  description: {
    color: '#666',
    marginTop: 4,
  },
}); 