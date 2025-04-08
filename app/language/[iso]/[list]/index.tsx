import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Surface, IconButton } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';

import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useDatabase } from '@/hooks/useDatabase.tsx';
import { Word } from '@/hooks/database/types';
import { ListInfoOverlay } from '@/components/ListInfoOverlay';

const ProficiencyBar = ({ proficiency, isKnown }: { proficiency: number; isKnown: number }) => {
  const getStatusColor = () => {
    if (proficiency === 0) return '#9E9E9E'; // Gray for unanswered
    return isKnown === 1 ? '#4CAF50' : '#F44336'; // Green for correct, Red for wrong
  };

  const getBarColor = () => {
    // Convert proficiency to a value between 0 and 1
    const progress = proficiency / 100;
    
    if (progress < 0.5) {
      // Transition from red to gray (0% to 50%)
      const redToGray = progress * 2; // Scale to 0-1 range
      const red = Math.floor(244 * (1 - redToGray) + 158 * redToGray);
      const green = Math.floor(67 * (1 - redToGray) + 158 * redToGray);
      const blue = Math.floor(54 * (1 - redToGray) + 158 * redToGray);
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      // Transition from gray to green (50% to 100%)
      const grayToGreen = (progress - 0.5) * 2; // Scale to 0-1 range
      const red = Math.floor(158 * (1 - grayToGreen) + 76 * grayToGreen);
      const green = Math.floor(158 * (1 - grayToGreen) + 175 * grayToGreen);
      const blue = Math.floor(158 * (1 - grayToGreen) + 80 * grayToGreen);
      return `rgb(${red}, ${green}, ${blue})`;
    }
  };

  return (
    <View style={styles.proficiencyContainer}>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
      <View style={styles.proficiencyBarContainer}>
        <View style={[styles.proficiencyBar, { 
          width: `${proficiency}%`,
          backgroundColor: getBarColor()
        }]} />
      </View>
    </View>
  );
};

export default function ListPage() {
  const { state } = useNavigationContext();
  const { goToAddWordType, goToMemorize, goToEditWord } = useNavigationHelper();
  const database = useDatabase();
  const [showInfo, setShowInfo] = useState(false);

  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWords = useCallback(async () => {
    try {
      if (!state.currentList?.uuid) {
        setError('List not found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const loadedWords = await database.getWordsByList(state.currentList.uuid);
      setWords(loadedWords);
      setError(null);
    } catch (error) {
      console.error('Error loading words:', error);
      setError('Failed to load words');
    } finally {
      setIsLoading(false);
    }
  }, [state.currentList?.uuid]);

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [loadWords])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={1}>
        <View style={styles.headerContent}>
          <Text variant="headlineSmall" style={styles.listName}>
            {state.currentList?.name}
          </Text>
          <IconButton
            icon="help-circle"
            size={24}
            onPress={() => setShowInfo(true)}
            style={styles.helpButton}
          />
        </View>
        <Text variant="bodyMedium" style={styles.wordCount}>
          {words.length} {words.length === 1 ? 'word' : 'words'}
        </Text>
      </Surface>
      <FlatList
        style={styles.flatList}
        data={words}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardTextContainer}>
                <Text variant="titleMedium">{item.translation}</Text>
                <Text variant="bodyMedium">{item.word}</Text>
                {item.example && (
                  <Text variant="bodySmall" style={styles.example}>
                    {item.example}
                  </Text>
                )}
                <ProficiencyBar proficiency={item.proficiency} isKnown={item.isKnown} />
              </View>
              <IconButton
                icon="pencil"
                size={24}
                onPress={() => {
                  goToEditWord(item.uuid);
                }}
                style={styles.editButton}
              />
            </Card.Content>
          </Card>
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={goToAddWordType}
      />
      <FAB
        icon="lightbulb"
        style={[styles.fab, styles.memorizeFab]}
        onPress={goToMemorize}
      />
      <ListInfoOverlay
        visible={showInfo}
        onDismiss={() => setShowInfo(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listName: {
    textAlign: 'center',
  },
  wordCount: {
    textAlign: 'center',
    color: '#666',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  example: {
    color: '#666',
    marginTop: 0,
  },
  editButton: {
    margin: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  memorizeFab: {
    bottom: 80,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    margin: 16,
  },
  flatList: {
    marginTop: 16,
  },
  proficiencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 2,
    marginRight: 8,
  },
  proficiencyBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  proficiencyBar: {
    height: '100%',
    borderRadius: 2,
  },
  helpButton: {
    marginLeft: 8,
  },
});