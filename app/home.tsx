import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { useTheme } from "react-native-paper";

import LanguageSelector from "@/components/LanguageSelector";
import { useNavigationHelper } from "@/hooks/useNavigation";

export default function Home() {
  const theme = useTheme();
  const { goOnboarding } = useNavigationHelper();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={0}>
        <View style={styles.titleContainer}>
          <Text variant="headlineMedium" style={styles.title}>QuickLearner</Text>
          <IconButton
            icon="help-circle"
            size={24}
            onPress={goOnboarding}
            style={styles.helpButton}
          />
        </View>
        <Text variant="bodyLarge" style={styles.subtitle}>Start your language journey</Text>
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
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  helpButton: {
    marginLeft: 8,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
