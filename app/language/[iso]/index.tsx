import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { Text, Surface, Button, ActivityIndicator, IconButton, TextInput } from 'react-native-paper';
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
import { spacing, typography } from '@/styles/tokens';
import { useAppTheme } from '@/styles/ThemeContext';
import UnifiedSeperator from '@/components/UnifiedSeperator';
import UnifiedAddButton from '@/components/UnifiedAddButton';
import UnifiedDialog from '@/components/UnifiedDialog';

export default function LanguagePage() {
  const { state, setCurrentList, setCurrentLanguage } = useNavigationContext();
  const { goToList } = useNavigationHelper();
  const database = useDatabase();
  const { colors } = useAppTheme();
  const [newListName, setNewListName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogVisible, setDialogVisible] = useState(false);

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
    setNewListName(''); // Reset input
    setDialogVisible(true);
  };

  const handleDialogSubmit = () => {
    addListLogic(newListName);
    setDialogVisible(false);
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
            <View style={entryStyles.loadingContainer}>
                <Text style={[typography.caption, {color: colors.text}]}>{i18n.t('error_no_language_selected')}</Text>
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
        <View style={entryStyles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={[typography.caption, {color: colors.text}]}>{i18n.t('loading_lists')}</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      <UnifiedDialog
          visible={isDialogVisible}
          onDismiss={() => setDialogVisible(false)}
          title={i18n.t('add_list')}
          actions={
              <>
              </>
            }
          >
          <TextInput
              label={i18n.t('enter_list_name')}
              value={newListName}
              onChangeText={setNewListName}
              textColor={colors.accent}
              autoFocus
            />
      </UnifiedDialog>
      <UnifiedHeader 
        title={state.currentLanguage.name}
      />
      <ScrollView style={{flex: 1}} contentContainerStyle={styles.scrollContentContainer}>
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
                style={[entryStyles.card, {backgroundColor: colors.background}]}
                elevation={0}
              >
                <TouchableOpacity
                  onPress={() => handleListSelect(list)}
                  onLongPress={() => Alert.alert(list.name, list.description || '')}
                  style={{width: '100%', flex: 1}}
                >
                  <View style={entryStyles.cardRowContent}>
                    <View style={entryStyles.cardColumnContent}>
                      <Text style={[typography.subheader, { color: colors.text }]} numberOfLines={1}>{list.name}</Text>
                      {list.description && <Text style={[typography.caption, { color: colors.text }]} numberOfLines={2}>{list.description}</Text>}
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
});