import React, { useState, useEffect, useCallback, useMemo, ReactNode, useRef } from 'react';
import { View, StyleSheet, FlatList, Share, Platform, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Surface, IconButton, Button, Portal, Dialog, TextInput, Searchbar, Menu } from 'react-native-paper';
import { useFocusEffect, router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useDatabase } from '@/hooks/useDatabase.tsx';
import { Word } from '@/hooks/database/types';
import { exportList, importList } from '@/hooks/database/list';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { ListInfoOverlay } from '@/components/ListInfoOverlay';
import UnifiedHeader from "@/components/UnifiedHeader";
import UnifiedFooter from "@/components/UnifiedFooter";
import { entryStyles } from "@/styles/entryStyles";
import ProficiencyBar from "@/components/ProficiencyBar";
import SwipeableWordCard from "@/components/SwipeableWordCard";
import i18n from '@/i18n';
import { useAppTheme } from '@/styles/ThemeContext';

type SortOption = 'proficiency' | 'created_at' | 'abc' | 'word_type';
type SortDirection = 'asc' | 'desc';

export default function ListPage() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { state } = useNavigationContext();
  const { goToAddWordType, goToPracticeSettings, goToEditWord, goBack, goToSentences } = useNavigationHelper();
  const database = useDatabase();
  const [showInfo, setShowInfo] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [wordDetails, setWordDetails] = useState<ReactNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('proficiency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

  const sortWords = (wordsToSort: Word[]) => {
    return [...wordsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption) {
        case 'proficiency':
          comparison = a.proficiency - b.proficiency;
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'abc':
          comparison = a.translation.localeCompare(b.translation);
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
        setError(i18n.t('list_not_found'));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const loadedWords = await database.getWordsByList(state.currentList.uuid);
      const sortedWordsResult = sortWords(loadedWords);
      setWords(sortedWordsResult);
      setError(null);
    } catch (err) {
      console.error('Error loading words:', err);
      setError(i18n.t('failed_to_load_words'));
    } finally {
      setIsLoading(false);
    }
  }, [state.currentList?.uuid, sortOption, sortDirection, database, i18n.t]);

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
    } catch (expError) {
      console.error('Error exporting list:', expError);
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
      
      const fileContent = await FileSystem.readAsStringAsync(file.uri);
      console.log('File content:', fileContent);
      
      try {
        const importedList = JSON.parse(fileContent);
        console.log('Parsed list:', importedList);
        
        const newListId = await importList(importedList);
        console.log('List imported successfully:', newListId);
        
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
    } catch (impError) {
      console.error('Error importing list:', impError);
      Alert.alert(
        i18n.t('import_error_title'),
        i18n.t('import_error_message'),
        [{ text: i18n.t('ok') }]
      );
    }
  };

  const handleDeleteWord = async (word: Word) => {
    closeSwipeable(word.uuid);
    Alert.alert(
      i18n.t('delete_word_confirm_title'),
      i18n.t('delete_word_confirm_message', { word: word.word }),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await database.deleteWord(word.uuid);
              loadWords();
            } catch (delError) {
              console.error('Error deleting word:', delError);
              Alert.alert(i18n.t('Error'), i18n.t('failed_to_delete_word'));
            }
          }
        }
      ]
    );
  };

  const handleEditWord = (word: Word) => {
    closeSwipeable(word.uuid);
    goToEditWord(word.uuid);
  };

  const openSortMenu = () => setShowSortMenu(true);
  const closeSortMenu = () => setShowSortMenu(false);

  const applySort = (option: SortOption) => {
    if (option === sortOption) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('desc');
    }
    closeSortMenu();
  };
  
  const closeSwipeable = (key: string) => {
    if (swipeableRefs.current[key]) {
      swipeableRefs.current[key]?.close();
    }
  };

  const renderWordDetails = async (word: Word) => {
    setWordDetails(
      <View style={styles.wordDetails}>
        <View style={styles.detailSection}>
          <Text style={[styles.detailLabel, { color: colors.muted }]}>{i18n.t('word')}:</Text>
          <Text style={{ color: colors.text }}>{word.word}</Text>
        </View>
        <View style={styles.detailSection}>
          <Text style={[styles.detailLabel, { color: colors.muted }]}>{i18n.t('translation')}:</Text>
          <Text style={{ color: colors.text }}>{word.translation}</Text>
        </View>
        <View style={styles.detailSection}>
          <Text style={[styles.detailLabel, { color: colors.muted }]}>{i18n.t('type')}:</Text>
          <Text style={{ color: colors.text }}>{word.type}</Text>
        </View>
        {word.example && (
          <View style={styles.detailSection}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>{i18n.t('example')}:</Text>
            <Text style={{ color: colors.text }}>{word.example}</Text>
          </View>
        )}
      </View>
    );
    setSelectedWord(word);
    setShowInfo(true);
  };

  const handlePracticeSentences = () => {
    if (state.currentLanguage && state.currentList) {
        goToSentences(state.currentLanguage, state.currentList);
    } else {
        Alert.alert(i18n.t('Error'), i18n.t('list_or_language_not_found'));
    }
  };

  const headerActions = (
    <View>
      <IconButton icon="sort" onPress={openSortMenu} />
      <Menu
        visible={showSortMenu}
        onDismiss={closeSortMenu}
        anchor={<View style={{width:0, height:0}} />}
      >
        <Menu.Item onPress={() => applySort('proficiency')} title={i18n.t('sort_proficiency')} />
        <Menu.Item onPress={() => applySort('created_at')} title={i18n.t('sort_date_added')} />
        <Menu.Item onPress={() => applySort('abc')} title={i18n.t('sort_alphabetical')} />
        <Menu.Item onPress={() => applySort('word_type')} title={i18n.t('sort_word_type')} />
        <Menu.Item onPress={handlePracticeSentences} title={i18n.t('practice_sentences')} />
        <Menu.Item onPress={handleExport} title={i18n.t('export_list')} />
        <Menu.Item onPress={handleImport} title={i18n.t('import_list')} />
      </Menu>
    </View>
  );
  
  const toggleWordSelection = (word: Word) => {
    setSelectedWords(prev => 
      prev.find(w => w.uuid === word.uuid) 
        ? prev.filter(w => w.uuid !== word.uuid)
        : [...prev, word]
    );
  };

  const renderItem = ({ item }: { item: Word }) => {
    const wordSwipeableRef = React.createRef<Swipeable>();
    swipeableRefs.current[item.uuid] = wordSwipeableRef.current;

    return (
        <SwipeableWordCard
            swipeableRef={wordSwipeableRef}
            onSwipeLeft={() => handleEditWord(item)}
            onSwipeRight={() => handleDeleteWord(item)}
        >
            <TouchableOpacity onPress={() => renderWordDetails(item)} onLongPress={() => toggleWordSelection(item)}>
                <Surface 
                    style={[
                        entryStyles.card, 
                        styles.card, 
                        { backgroundColor: colors.background },
                        selectedWords.find(w => w.uuid === item.uuid) ? styles.selectedCard : {}
                    ]} 
                    elevation={1}
                >
                    <View style={entryStyles.cardContent}>
                        <View style={entryStyles.wordCardTextContainer}>
                            <Text style={[entryStyles.wordTranslation, { color: colors.text }]}>{item.translation}</Text>
                            <Text style={[entryStyles.wordOriginal, { color: colors.muted }]}>{item.word}</Text>
                            {item.example && <Text style={[styles.example, {color: colors.muted}]}>{item.example}</Text>}
                        </View>
                        <View style={entryStyles.wordProficiencyContainer}>
                            <ProficiencyBar proficiency={item.proficiency} isKnown={item.isKnown} />
                        </View>
                    </View>
                </Surface>
            </TouchableOpacity>
        </SwipeableWordCard>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={{color: colors.muted}}>{i18n.t('no_words_in_list')}</Text>
    </View>
  );

  const renderAddWordButton = () => (
    <TouchableOpacity onPress={() => goToAddWordType()} disabled={isLoading}>
        <Surface 
            style={[
                entryStyles.card, 
                { backgroundColor: colors.background, borderColor: colors.secondary, marginHorizontal: 8 }
            ]} 
            elevation={1}
        >
            <IconButton icon="plus" size={24} iconColor={colors.primary} />
            <Text style={[entryStyles.addButtonText, { color: colors.primary }]}>
                {i18n.t('add_word')}
            </Text>
        </Surface>
    </TouchableOpacity>
  );
  
  if (!state.currentList) {
    return (
      <SafeAreaWrapper backgroundColor={colors.background}>
        <UnifiedHeader title={i18n.t('list_not_found')} />
        <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{color: colors.text}}>{i18n.t('list_not_found_message')}</Text>
          <Button onPress={() => goBack()}>{i18n.t('go_back')}</Button>
        </View>
        <UnifiedFooter />
      </SafeAreaWrapper>
    );
  }

  if (isLoading && (!words || words.length === 0)) { 
    return (
      <SafeAreaWrapper backgroundColor={colors.background}>
        <UnifiedHeader 
            title={state.currentList.name} 
        />
        <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" animating={true} color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.text }}>{i18n.t('loading_words')}</Text>
        </View>
        <UnifiedFooter />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor={colors.background} excludeEdges={['bottom']}>
      <UnifiedHeader
        title={state.currentList?.name || ''}
        actions={
          selectMode ? (
            <>
              <Button 
                mode="contained" 
                onPress={handlePracticeSentences}
                style={styles.practiceButton}
              >
                {i18n.t('practice_selected')}
              </Button>
              <Button 
                onPress={() => {
                  setSelectMode(false);
                  setSelectedWords([]);
                }}
              >
                {i18n.t('cancel')}
              </Button>
            </>
          ) : (
            <>
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
            </>
          )
        }
      />
      <Searchbar
        placeholder={i18n.t('search_words')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, {backgroundColor: colors.background, color: colors.text}]}
        inputStyle={{color: colors.text}}
        iconColor={colors.muted}
        placeholderTextColor={colors.muted}
        elevation={1}
      />
      <FlatList
        data={filteredWords}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContentContainer}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderAddWordButton}
      />
      <FAB
        icon="lightbulb"
        style={[styles.fab, styles.memorizeFab, { bottom: insets.bottom + 80 }]}
        onPress={goToPracticeSettings}
      />
      <FAB
        icon="translate"
        style={[styles.fab, styles.practiceFab, { bottom: insets.bottom + 144 }]}
        onPress={() => setSelectMode(!selectMode)}
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
            <View>
              <Dialog.Title>{selectedWord.translation}</Dialog.Title>
              <Dialog.Content>
                <Text variant="titleMedium" style={styles.dialogWord}>{selectedWord.word}</Text>
                {wordDetails}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setSelectedWord(null)}>{i18n.t('close')}</Button>
              </Dialog.Actions>
            </View>
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
          <Dialog.Actions>
            <Button onPress={() => setShowSortMenu(false)}>{i18n.t('cancel')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <UnifiedFooter />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
  },
  flatListContentContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  card: {
    marginHorizontal: 8,
    marginBottom: 6,
  },
  example: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  searchBar: {
    marginHorizontal: 8,
    marginBottom: 2,
    marginTop: 2,
  },
  wordDialog: {
    maxHeight: '80%',
  },
  wordDetails: {
    gap: 12,
  },
  detailSection: {
    gap: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  selectedCard: {
  },
  practiceButton: {
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  memorizeFab: {
    backgroundColor: '#4CAF50',
  },
  practiceFab: {
    backgroundColor: '#2196F3',
  },
  sortMenu: {
    maxHeight: '80%',
  },
  sortOptions: {
    gap: 8,
  },
  sortButton: {
    width: '100%',
  },
  dialogWord: {
    fontWeight: 'bold',
  },
});