import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  ActivityIndicator,
} from "react-native-paper";
import React from "react";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import { useDatabase } from "@/hooks/useDatabase";
import { useNavigationHelper } from "@/hooks/useNavigation";
import { useNavigationContext } from "@/hooks/useNavigationContext";

import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import UnifiedHeader from "@/components/UnifiedHeader";
import UnifiedFooter from "@/components/UnifiedFooter";
import SwipeableListCard from "@/components/SwipeableListCard";
import UnifiedSeperator from "@/components/UnifiedSeperator";
import UnifiedAddButton from "@/components/UnifiedAddButton";
import UnifiedButton from "@/components/UnifiedButton";
import UnifiedDialog from "@/components/UnifiedDialog";
import UnifiedTextInput from "@/components/UnifiedTextInput";

import i18n from "@/i18n";
import { entryStyles } from "@/styles/entryStyles";
import { spacing, typography } from "@/styles/tokens";
import { useAppTheme } from "@/styles/ThemeContext";

export default function LanguagePage() {
  const { state, setCurrentList, setCurrentLanguage } = useNavigationContext();
  const database = useDatabase();
  const { goToList } = useNavigationHelper();
  const { colors } = useAppTheme();
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [listToDelete, setListToDelete] = useState<any>(null);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null
  );

  useEffect(() => {
    const loadLists = async () => {
      if (!state.currentLanguage?.uuid) return;
      try {
        setIsLoading(true);
        const lists = await database.getListsByLanguage(
          state.currentLanguage.iso
        );
        console.log("lists", lists);
        setCurrentLanguage({ ...state.currentLanguage, lists });
        console.log("state.currentLanguage", state.currentLanguage);
      } catch (error) {
        console.error("Error loading lists:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // Ensure database is ready before loading lists
    if (!database.isLoading && database.isInitialized) {
      loadLists();
    }
  }, [state.currentLanguage?.uuid, database.isLoading, database.isInitialized]);

  const addListLogic = async (name: string, description: string) => {
    if (name && name.trim() && state.currentLanguage) {
      try {
        setIsLoading(true);
        const result = await database.addList(
          state.currentLanguage.iso,
          name.trim(),
          description.trim()
        );
        if (result && state.currentLanguage.lists) {
          setCurrentLanguage({
            ...state.currentLanguage,
            lists: [...state.currentLanguage.lists, result],
          });
          setNewListName("");
        }
      } catch (error) {
        console.error("Error adding list:", error);
        setError({
          title: i18n.t("Error"),
          message: i18n.t("failed_to_add_list"),
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddList = async () => {
    setNewListName(""); // Reset input
    setNewListDescription(""); // Reset input
    setDialogVisible(true);
  };

  const handleDialogSubmit = () => {
    addListLogic(newListName, newListDescription);
    setDialogVisible(false);
  };

  const handleConfirmDelete = async () => {
    if (!listToDelete) return;
    try {
      setIsLoading(true);
      await database.deleteList(listToDelete.uuid);
      if (state.currentLanguage?.lists) {
        setCurrentLanguage({
          ...state.currentLanguage,
          lists: state.currentLanguage.lists.filter(
            (l) => l.uuid !== listToDelete.uuid
          ),
        });
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      setError({
        title: i18n.t("delete_error_title"),
        message: i18n.t("delete_error_message"),
      });
    } finally {
      setIsLoading(false);
      setDeleteConfirmationVisible(false);
      setListToDelete(null);
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

  const handleDeleteList = (list: typeof state.currentList) => {
    if (!list) return;
    setListToDelete(list);
    setDeleteConfirmationVisible(true);
  };

  if (!state.currentLanguage) {
    return (
      <SafeAreaWrapper backgroundColor={colors.background}>
        <View style={entryStyles.loadingContainer}>
          <Text style={[typography.caption, { color: colors.text }]}>
            {i18n.t("error_no_language_selected")}
          </Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  // Loading Screen
  if (
    isLoading &&
    (!state.currentLanguage.lists || state.currentLanguage.lists.length === 0)
  ) {
    return (
      <SafeAreaWrapper backgroundColor={colors.background}>
        <UnifiedHeader title={state.currentLanguage.name} />
        <View style={entryStyles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={[typography.caption, { color: colors.text }]}>
            {i18n.t("loading_lists")}
          </Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      <UnifiedDialog
        visible={isDialogVisible}
        onDismiss={() => setDialogVisible(false)}
        title={i18n.t("add_list")}
        actions={
          <>
            <UnifiedButton
              onPress={() => setDialogVisible(false)}
              style={{ 
                flex: 1,
                backgroundColor: colors.error,
              }}
              textStyle={{ color: colors.onError }}
            >
              {i18n.t("cancel")}
            </UnifiedButton>
            <UnifiedButton
              onPress={handleDialogSubmit}
              style={{ 
                flex: 1,
                backgroundColor: colors.primary,
              }}
              textStyle={{ color: colors.onPrimaryOrSecondary }}
            >
              {i18n.t("add")}
            </UnifiedButton>
          </>
        }
      >
        <UnifiedTextInput
          label={i18n.t("enter_list_name")}
          value={newListName}
          onChangeText={setNewListName}
          autoFocus
        />
        <UnifiedTextInput
          label={i18n.t("enter_list_description")}
          value={newListDescription}
          onChangeText={setNewListDescription}
        />
      </UnifiedDialog>
      <UnifiedDialog
        visible={isDeleteConfirmationVisible}
        onDismiss={() => setDeleteConfirmationVisible(false)}
        title={i18n.t("delete_list_confirm_title")}
        actions={
          <>
            <UnifiedButton
              onPress={() => setDeleteConfirmationVisible(false)}
              style={{ 
                flex: 1,
                backgroundColor: colors.primary,
              }}
              textStyle={{ color: colors.onPrimaryOrSecondary }}
            >
              {i18n.t("cancel")}
            </UnifiedButton>
            <UnifiedButton
              onPress={handleConfirmDelete}
              style={{ 
                flex: 1,
                backgroundColor: colors.error,
              }}
              textStyle={{ color: colors.onError }}
            >
              {i18n.t("delete")}
            </UnifiedButton>
          </>
        }
      >
        <Text style={{ color: colors.text }}>
          {i18n.t("delete_list_confirm_message")}
        </Text>
      </UnifiedDialog>
      <UnifiedDialog
        visible={!!error}
        onDismiss={() => setError(null)}
        title={error?.title || ""}
        actions={
          <UnifiedButton
          onPress={() => setError(null)}
          style={{ 
            flex: 1,
            backgroundColor: colors.primary,
          }}
            textStyle={{ color: colors.onPrimaryOrSecondary }}
          >
            {i18n.t("ok")}
          </UnifiedButton>
        }
      >
        <Text style={{ color: colors.text }}>{error?.message || ""}</Text>
      </UnifiedDialog>
      <UnifiedHeader title={state.currentLanguage.name} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {state.currentLanguage.lists?.map((list, index) => {
          const listSwipeableRef = React.createRef<SwipeableMethods>();
          const isLastItem =
            index === (state.currentLanguage?.lists?.length || 0) - 1;

          return (
            <View key={list.uuid}>
              <SwipeableListCard
                swipeableRef={listSwipeableRef}
                onSwipeLeft={() => handleDeleteList(list)}
                onSwipeRight={() => handleDeleteList(list)}
              >
                <View
                  style={[
                    entryStyles.card,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleListSelect(list)}
                    onLongPress={() =>
                      Alert.alert(list.name, list.description || "-")
                    }
                    style={{ width: "100%", flex: 1 }}
                  >
                    <View style={entryStyles.cardRowContent}>
                      <View style={entryStyles.cardColumnContent}>
                        <Text
                          style={[typography.subheader, { color: colors.text }]}
                          numberOfLines={1}
                        >
                          {list.name}
                        </Text>
                        <Text
                          style={[typography.caption, { color: colors.text }]}
                          numberOfLines={1}
                        >
                          {list.description || "-"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </SwipeableListCard>
              {!isLastItem && <UnifiedSeperator />}
            </View>
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
