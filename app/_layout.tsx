import React from "react";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

import { NavigationProvider } from '@/hooks/useNavigationContext';
import { DatabaseProvider } from '@/hooks/useDatabase';
import { ThemeProvider, useAppTheme } from "@/styles/ThemeContext";

// AppContent is split from RootLayout so that the Statusbar rerenders upon theme changes
function AppContent() {
  const { theme, colors } = useAppTheme();

  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationProvider>
            <Stack screenOptions={{
              headerShown: false,
            }}>
              <Stack.Screen name="home" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen
                name="settings"
                options={{
                  title: 'Settings',
                }}
              />
            </Stack>
          </NavigationProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </View>
  );
}

export default function RootLayout() {
  // RootLayout is now primarily for setting up global providers.
  // It no longer directly consumes the theme for its immediate children.
  // AppContent re-renders when theme changes, so the StatusBar re-renders too.
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <DatabaseProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureHandler: {
    flex: 1,
  },
});
