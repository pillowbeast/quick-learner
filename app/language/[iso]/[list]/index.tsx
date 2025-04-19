import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, ScrollView, Share, Platform, Alert } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Surface, IconButton, Button, Portal, Dialog, TextInput, Searchbar, Menu } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useDatabase } from '@/hooks/useDatabase.tsx';
import { Word } from '@/hooks/database/types';
import { ListInfoOverlay } from '@/components/ListInfoOverlay';
import i18n from '@/i18n';
import { exportList, importList } from '@/hooks/database/list';
import BackButton from '@/components/BackButton';

type SortOption = 'proficiency' | 'created_at' | 'abc' | 'word_type';
type SortDirection = 'asc' | 'desc';

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
  const { goToAddWordType, goToSettings, goToEditWord, goBack } = useNavigationHelper();
  const database = useDatabase();
  const [showInfo, setShowInfo] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [wordDetails, setWordDetails] = useState<JSX.Element | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortWords = (words: Word[]) => {
    return [...words].sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption) {
        case 'proficiency':
          comparison = a.proficiency - b.proficiency;
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'abc':
          comparison = a.word.localeCompare(b.word);
          break;
        case 'word_type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredWords = useMemo(() => {
    if (!debouncedSearchQuery) return words;
    
    const query = debouncedSearchQuery.toLowerCase();
    return words.filter(word => 
      word.word.toLowerCase().includes(query) || 
      word.translation.toLowerCase().includes(query)
    );
  }, [words, debouncedSearchQuery]);

  const loadWords = useCallback(async () => {
    try {
      if (!state.currentList?.uuid) {
        setError('List not found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const loadedWords = await database.getWordsByList(state.currentList.uuid);
      const sortedWords = sortWords(loadedWords);
      setWords(sortedWords);
      setError(null);
    } catch (error) {
      console.error('Error loading words:', error);
      setError('Failed to load words');
    } finally {
      setIsLoading(false);
    }
  }, [state.currentList?.uuid, sortOption, sortDirection]);

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [loadWords])
  );

  const handleExport = async () => {
    try {
      if (!state.currentList?.uuid) {
        throw new Error('No list selected');
      }

      console.log('Exporting list:', state.currentList.uuid);
      const exportedList = await exportList(state.currentList.uuid);
      console.log('Exported list data:', exportedList);
      
      const jsonString = JSON.stringify(exportedList, null, 2);
      console.log('JSON string:', jsonString);
      
      if (Platform.OS === 'web') {
        console.log('Using web export method');
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exportedList.name}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.log('Using mobile export method');
        const fileName = `QuickLearner_${exportedList.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
        
        console.log('Writing to file:', fileUri);
        await FileSystem.writeAsStringAsync(fileUri, jsonString);
        console.log('File written successfully');
        
        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          throw new Error('Failed to create file');
        }

        // Use expo-sharing to share the file
        if (!(await Sharing.isAvailableAsync())) {
          throw new Error('Sharing is not available on this device');
        }

        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: `Share ${fileName}`,
          UTI: 'public.json'
        });
      }
    } catch (error) {
      console.error('Error exporting list:', error);
      // Show error to user
      Alert.alert(
        i18n.t('export_error_title'),
        i18n.t('export_error_message'),
        [{ text: i18n.t('ok') }]
      );
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      console.log('Selected file:', file);
      
      // Read the file content
      const fileContent = await FileSystem.readAsStringAsync(file.uri);
      console.log('File content:', fileContent);
      
      try {
        const importedList = JSON.parse(fileContent);
        console.log('Parsed list:', importedList);
        
        // Import the list
        const newListId = await importList(importedList);
        console.log('List imported successfully:', newListId);
        
        // Refresh the list
        loadWords();
        
        Alert.alert(
          i18n.t('import_success_title'),
          i18n.t('import_success_message'),
          [{ text: i18n.t('ok') }]
        );
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        Alert.alert(
          i18n.t('import_error_title'),
          i18n.t('import_error_invalid_json'),
          [{ text: i18n.t('ok') }]
        );
      }
    } catch (error) {
      console.error('Error importing list:', error);
      Alert.alert(
        i18n.t('import_error_title'),
        i18n.t('import_error_message'),
        [{ text: i18n.t('ok') }]
      );
    }
  };

  const handleDeleteWord = async (word: Word) => {
    Alert.alert(
      i18n.t('delete_word_confirm_title'),
      i18n.t('delete_word_confirm_message'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel'
        },
        {
          text: i18n.t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await database.deleteWord(word.uuid);
              // Refresh the word list
              loadWords();
            } catch (error) {
              console.error('Error deleting word:', error);
              Alert.alert(
                i18n.t('delete_error_title'),
                i18n.t('delete_error_message')
              );
            }
          }
        }
      ]
    );
  };

  const renderWordDetails = async (word: Word) => {
    const properties = await database.getWordProperties(word.uuid);
    const details = (
      <View style={styles.wordDetails}>
        {word.example && (
          <View style={styles.detailSection}>
            <Text variant="labelMedium" style={styles.detailLabel}>{i18n.t('example')}:</Text>
            <Text variant="bodyMedium">{word.example}</Text>
          </View>
        )}
        {properties.map((property) => (
          <View key={property.name} style={styles.detailSection}>
            <Text variant="labelMedium" style={styles.detailLabel}>{property.name}:</Text>
            <Text variant="bodyMedium">{String(property.value)}</Text>
          </View>
        ))}
      </View>
    );
    setWordDetails(details);
  };

  // Add effect to load word details when a word is selected
  useEffect(() => {
    if (selectedWord) {
      renderWordDetails(selectedWord);
    } else {
      setWordDetails(null);
    }
  }, [selectedWord]);

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
      <BackButton />
      <Surface style={styles.header} elevation={1}>
        <View style={styles.headerContent}>
          <Text variant="bodyMedium" style={styles.wordCount}>
            {words.length} {words.length === 1 ? i18n.t('word_singular') : i18n.t('word_plural')}
          </Text>
          <Text variant="headlineSmall" style={styles.listName}>
            {state.currentList?.name}
          </Text>
          <View style={styles.headerActions}>
            <IconButton
              icon="help-circle"
              size={24}
              onPress={() => setShowInfo(true)}
            />
            <IconButton
              icon="export"
              size={24}
              onPress={handleExport}
            />
            <IconButton
              icon="import"
              size={24}
              onPress={handleImport}
            />
            <IconButton
              icon="sort"
              size={24}
              style={{marginRight: -6}}
              onPress={() => setShowSortMenu(true)}
            />
            <IconButton
              style={{marginLeft: -6}}
              icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={24}
              onPress={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            />
          </View>
        </View>
      </Surface>
      <FlatList
        style={styles.flatList}
        data={filteredWords}
        keyExtractor={(item) => item.uuid}
        ListHeaderComponent={
          <Searchbar
            placeholder={i18n.t('search_words')}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        }
        renderItem={({ item }) => (
          <Card 
            style={styles.card}
            onPress={() => setSelectedWord(item)}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardTextContainer}>
                <Text variant="titleMedium">{item.translation}</Text>
                <Text variant="bodyMedium">{item.word}</Text>
                <ProficiencyBar proficiency={item.proficiency} isKnown={item.isKnown} />
              </View>
              <View style={styles.cardActions}>
                <IconButton
                  icon="pencil"
                  size={24}
                  onPress={() => {
                    goToEditWord(item.uuid);
                  }}
                  style={styles.editButton}
                />
                <IconButton
                  icon="delete"
                  size={24}
                  onPress={() => handleDeleteWord(item)}
                  style={styles.deleteButton}
                />
              </View>
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
        onPress={goToSettings}
      />
      <ListInfoOverlay
        visible={showInfo}
        onDismiss={() => setShowInfo(false)}
      />
      <Portal>
        <Dialog 
          visible={!!selectedWord} 
          onDismiss={() => setSelectedWord(null)}
          style={styles.wordDialog}
        >
          {selectedWord && (
            <>
              <Dialog.Title>{selectedWord.translation}</Dialog.Title>
              <Dialog.Content>
                <Text variant="titleMedium" style={styles.dialogWord}>{selectedWord.word}</Text>
                {wordDetails}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setSelectedWord(null)}>{i18n.t('close')}</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
      <Portal>
        <Dialog 
          visible={showSortMenu} 
          onDismiss={() => setShowSortMenu(false)}
          style={styles.sortMenu}
        >
          <Dialog.Title>{i18n.t('sort_by')}</Dialog.Title>
          <Dialog.Content>
            <View style={styles.sortOptions}>
              <Button
                mode={sortOption === 'proficiency' ? 'contained' : 'text'}
                onPress={() => {
                  setSortOption('proficiency');
                  setShowSortMenu(false);
                }}
                style={styles.sortButton}
              >
                {i18n.t('proficiency')}
              </Button>
              <Button
                mode={sortOption === 'created_at' ? 'contained' : 'text'}
                onPress={() => {
                  setSortOption('created_at');
                  setShowSortMenu(false);
                }}
                style={styles.sortButton}
              >
                {i18n.t('date')}
              </Button>
              <Button
                mode={sortOption === 'abc' ? 'contained' : 'text'}
                onPress={() => {
                  setSortOption('abc');
                  setShowSortMenu(false);
                }}
                style={styles.sortButton}
              >
                {i18n.t('alphabetical')}
              </Button>
              <Button
                mode={sortOption === 'word_type' ? 'contained' : 'text'}
                onPress={() => {
                  setSortOption('word_type');
                  setShowSortMenu(false);
                }}
                style={styles.sortButton}
              >
                {i18n.t('word_type')}
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Content>
            <Button onPress={() => setShowSortMenu(false)}>{i18n.t('cancel')}</Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
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
    flexDirection: 'column',
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
    marginHorizontal: 8,
    marginBottom: 6,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
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
  deleteButton: {
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
    marginTop: 8,
  },
  proficiencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 2,
    marginRight: 6,
  },
  proficiencyBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  proficiencyBar: {
    height: '100%',
    borderRadius: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  importInput: {
    marginTop: 16,
    minHeight: 120,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordDialog: {
    maxHeight: '80%',
  },
  dialogWord: {
    marginBottom: 16,
  },
  wordDetails: {
    gap: 12,
  },
  detailSection: {
    gap: 4,
  },
  detailLabel: {
    color: '#666',
  },
  searchBar: {
    marginTop: 2,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  sortMenu: {
    padding: 8,
    width: 360,
    maxHeight: 400,
    alignSelf: 'center',
  },
  sortOptions: {
    gap: 8,
  },
  sortButton: {
    justifyContent: 'flex-start',
  },
});