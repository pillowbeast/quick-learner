import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Surface, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

import { useDatabase } from '@/hooks/useDatabase';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useNavigationContext } from '@/hooks/useNavigationContext';
import Flag from '@/components/Flag';


export default function LanguagePage() {
  const theme = useTheme();
  const { state, setCurrentList, setCurrentLanguage } = useNavigationContext();
  const { goToList } = useNavigationHelper();
  const database = useDatabase();

  const [newListName, setNewListName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLists = async () => {
      if (!state.currentLanguage?.uuid) return;
      try {
        setIsLoading(true);
        const lists = await database.getListsByLanguage(state.currentLanguage.uuid);
        console.log('lists', lists);
        setCurrentLanguage({ ...state.currentLanguage, lists });
        console.log('state.currentLanguage', state.currentLanguage);
      } catch (error) {
        console.error('Error loading lists:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLists();
  }, [state.currentLanguage?.uuid]);

  const handleAddList = async () => {
    if (!newListName.trim() || !state.currentLanguage) return;
    
    try {
      setIsLoading(true);
      const result = await database.addList(state.currentLanguage.uuid, newListName);
      if (result && state.currentLanguage.lists) {
        setCurrentLanguage({
          ...state.currentLanguage,
          lists: [...state.currentLanguage.lists, result]
        });
        setNewListName("");
      }
    } catch (error) {
      console.error('Error adding list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListSelect = (list: typeof state.currentList) => {
    if (!list) return;
    setCurrentList(list);
    goToList(state.currentLanguage!, list);
  };

  if (!state.currentLanguage) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading lists...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineMedium" style={styles.title}>{state.currentLanguage.name}</Text>
        <Flag iso={state.currentLanguage.iso} />
      </Surface>

      <ScrollView style={styles.content}>
        {state.currentLanguage.lists?.map((list) => (
          <Surface 
            key={list.uuid} 
            style={[styles.card, { backgroundColor: theme.colors.surface }]} 
            elevation={1}
          >
            <View style={styles.cardContent}>
              <Text style={styles.listName}>{list.name}</Text>
              <Button
                mode="contained"
                onPress={() => handleListSelect(list)}
              >
                View
              </Button>
            </View>
          </Surface>
        ))}
      </ScrollView>

      <Surface style={styles.footer} elevation={2}>
        <TextInput
          placeholder="Enter list name"
          value={newListName}
          onChangeText={setNewListName}
          style={styles.input}
          onSubmitEditing={handleAddList}
        />
        <Button
          mode="contained"
          onPress={handleAddList}
          disabled={!newListName.trim()}
        >
          Add List
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  input: {
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
});