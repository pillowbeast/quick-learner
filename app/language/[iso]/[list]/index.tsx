import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Surface, IconButton } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';

import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useDatabase } from '@/hooks/useDatabase.tsx';
import { Word } from '@/hooks/database/types';


export default function ListPage() {
  const { state } = useNavigationContext();
  const { goToAddWordType, goToMemorize, goToEditWord } = useNavigationHelper();
  const database = useDatabase();

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
        <Text variant="headlineSmall" style={styles.listName}>
          {state.currentList?.name}
        </Text>
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
});