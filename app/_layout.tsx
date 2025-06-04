import React from "react";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import { NavigationProvider } from '@/hooks/useNavigationContext';
import { DatabaseProvider } from '@/hooks/useDatabase';
import { ThemeProvider, useAppTheme } from "@/styles/ThemeContext";

// AppContent is split from RootLayout so that the Statusbar rerenders upon theme changes
function AppContent() {
  const { theme } = useAppTheme();

  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
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
    </>
  );
}

export default function RootLayout() {
  // RootLayout is now primarily for setting up global providers.
  // It no longer directly consumes the theme for its immediate children.
  // AppContent re-renders when theme changes, so the StatusBar re-renders too.
  return (
    <GestureHandlerRootView>
      <DatabaseProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}
