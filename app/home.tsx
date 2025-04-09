import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { useTheme } from "react-native-paper";
import i18n from "@/i18n";

import LanguageSelector from "@/components/LanguageSelector";
import DisplayLanguageSelector from "@/components/DisplayLanguageSelector";
import { useNavigationHelper } from "@/hooks/useNavigation";
import Flag from "@/components/Flag";
import { useNavigationContext } from "@/hooks/useNavigationContext";

export default function Home() {
  const theme = useTheme();
  const { goOnboarding } = useNavigationHelper();
  const { state } = useNavigationContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <View style={styles.titleContainer}>
          <DisplayLanguageSelector />

          <Text variant="headlineMedium" style={styles.title}>{i18n.t('app_name')}</Text>
          <View style={styles.headerActions}>
            <IconButton
              icon="help-circle"
              size={24}
              onPress={goOnboarding}
              style={styles.helpButton}
            />
          </View>
        </View>
        <Text variant="bodyLarge" style={styles.subtitle}>{i18n.t('start_journey')}</Text>
      </Surface>

      <View style={styles.content}>
        <LanguageSelector />
      </View>
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
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    marginLeft: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
});
