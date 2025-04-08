import React, { useEffect, useState } from "react";
import { StatusBar } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { setupDatabase } from "@/hooks/database/init";
import { NavigationProvider } from '@/hooks/useNavigationContext';
import { DatabaseProvider } from '@/hooks/useDatabase';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4A90E2',
    secondary: '#F5A623',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    error: '#D32F2F',
  },
};

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await setupDatabase();
        setIsDatabaseInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    }
    initializeDatabase();
  }, []);

  if (!fontsLoaded || !isDatabaseInitialized) {
    return null;
  }

  return (
    <DatabaseProvider>
      <NavigationProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" />
            <Stack screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.background },
            }}>
              <Stack.Screen name="home" />
              <Stack.Screen name="language/[iso]" />
              <Stack.Screen name="language/[iso]/[list]" />
              <Stack.Screen name="language/[iso]/[list]/word/[uuid]" />
              <Stack.Screen name="language/[iso]/[list]/word/add_type" />
              <Stack.Screen name="language/[iso]/[list]/word/add_details" />
              <Stack.Screen name="language/[iso]/[list]/practice/study" />
              <Stack.Screen name="language/[iso]/[list]/practice/memorize" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="add_lang" />
            </Stack>
          </PaperProvider>
        </SafeAreaProvider>
      </NavigationProvider>
    </DatabaseProvider>
  );
}