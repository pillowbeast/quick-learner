import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { Text, Surface, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import React from 'react';
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'; 

import { useDatabase } from '@/hooks/useDatabase';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useNavigationContext } from '@/hooks/useNavigationContext';

import i18n from '@/i18n';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import UnifiedHeader from "@/components/UnifiedHeader";
import UnifiedFooter from "@/components/UnifiedFooter";
import { entryStyles } from "@/styles/entryStyles";
import SwipeableListCard from "@/components/SwipeableListCard";
import { typography } from '@/styles/tokens';
import { useAppTheme } from '@/styles/ThemeContext';
import UnifiedSeperator from '@/components/UnifiedSeperator';
import UnifiedAddButton from '@/components/UnifiedAddButton';

export default function LanguagePage() {
  const { state, setCurrentList, setCurrentLanguage } = useNavigationContext();
  const { goToList } = useNavigationHelper();
  const database = useDatabase();
  const { colors } = useAppTheme();
  const [newListName, setNewListName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLists = async () => {
      if (!state.currentLanguage?.uuid) return;
      try {
        setIsLoading(true);
        const lists = await database.getListsByLanguage(state.currentLanguage.iso);
        console.log('lists', lists);
        setCurrentLanguage({ ...state.currentLanguage, lists });
        console.log('state.currentLanguage', state.currentLanguage);
      } catch (error) {
        console.error('Error loading lists:', error);
      } finally {
        setIsLoading(false);
      }
    };
    // Ensure database is ready before loading lists
    if (!database.isLoading && database.isInitialized) {
        loadLists();
    }
  }, [state.currentLanguage?.uuid, database.isLoading, database.isInitialized]);

  const addListLogic = async (name: string) => {
    if (name && name.trim() && state.currentLanguage) {
      try {
        setIsLoading(true);
        const result = await database.addList(state.currentLanguage.iso, name.trim());
        if (result && state.currentLanguage.lists) {
          setCurrentLanguage({
            ...state.currentLanguage,
            lists: [...state.currentLanguage.lists, result]
          });
          setNewListName("");
        }
      } catch (error) {
        console.error('Error adding list:', error);
        Alert.alert(i18n.t('Error'), i18n.t('failed_to_add_list'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditList = (list: typeof state.currentList) => {
    console.log("Edit list:", list?.name);
    Alert.alert("Edit List", `Rename: ${list?.name}? (Not implemented yet)`);
  };

  const handleAddList = async () => {
    if (Platform.OS !== 'web') {
      Alert.prompt(
        i18n.t('add_list'),
        i18n.t('enter_list_name'),
        [
          { text: i18n.t('cancel'), style: 'cancel' },
          { text: i18n.t('add'), onPress: (name) => addListLogic(name || "") }
        ],
        'plain-text',
        newListName
      );
    } else {
      const nameFromPrompt = prompt(i18n.t('enter_list_name'), newListName);
      if (nameFromPrompt !== null) {
        addListLogic(nameFromPrompt);
      }
    }
  };

  const handleListSelect = (list: typeof state.currentList) => {
    if (!list) return;
    setCurrentList(list);
    if (state.currentLanguage) {
        goToList(state.currentLanguage, list);
    } else {
        console.error("Current language not set, cannot navigate to list");
        // Optionally, show an alert to the user
    }
  };

  const handleDeleteList = async (list: typeof state.currentList) => {
    if (!list) return;
    
    Alert.alert(
      i18n.t('delete_list_confirm_title'),
      i18n.t('delete_list_confirm_message'),
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
              setIsLoading(true);
              await database.deleteList(list.uuid);
              if (state.currentLanguage?.lists) {
                setCurrentLanguage({
                  ...state.currentLanguage,
                  lists: state.currentLanguage.lists.filter(l => l.uuid !== list.uuid)
                });
              }
            } catch (error) {
              console.error('Error deleting list:', error);
              Alert.alert(
                i18n.t('delete_error_title'),
                i18n.t('delete_error_message')
              );
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  if (!state.currentLanguage) {
    return (
        <SafeAreaWrapper backgroundColor={colors.background}>
            <View style={styles.loadingContainer}>
                <Text>Error: No language selected.</Text>
            </View>
        </SafeAreaWrapper>
    );
  }

  // Loading Screen
  if (isLoading && (!state.currentLanguage.lists || state.currentLanguage.lists.length === 0)) { 
    return (
      <SafeAreaWrapper backgroundColor={colors.background}>
        <UnifiedHeader 
          title={state.currentLanguage.name}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>{i18n.t('loading_lists')}</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      <UnifiedHeader 
        title={state.currentLanguage.name}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContentContainer}>
        {state.currentLanguage.lists?.map((list, index) => {
          const listSwipeableRef = React.createRef<SwipeableMethods>();
          const isLastItem = index === (state.currentLanguage?.lists?.length || 0) - 1;

          return (
            <SwipeableListCard
              key={list.uuid}
              swipeableRef={listSwipeableRef}
              onSwipeLeft={() => handleEditList(list)}
              onSwipeRight={() => handleDeleteList(list)}
            >
              <Surface 
                style={[entryStyles.card, { backgroundColor: colors.background }]}
                elevation={0}
              >
                <TouchableOpacity onPress={() => handleListSelect(list)} style={{width: '100%'}}>
                    <View style={entryStyles.cardContent}>
                      <View style={entryStyles.infoContainer}>
                          <View style={entryStyles.textContainer}>
                          <Text style={[typography.subheader, { color: colors.text }]}>{list.name}</Text>
                          {list.description && <Text style={[typography.body, { color: colors.text }]}>{list.description}</Text>}
                          </View>
                      </View>
                    </View>
                </TouchableOpacity>
              </Surface>
              {!isLastItem && <UnifiedSeperator/>}
            </SwipeableListCard>
          );
        })}
        <UnifiedAddButton onPress={handleAddList} onLongPress={handleAddList} />
      </ScrollView>
      <UnifiedFooter />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingVertical: 8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});