import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';

import { NavigationProvider } from '@/hooks/useNavigationContext';
import { DatabaseProvider } from '@/hooks/useDatabase';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const theme = useTheme();
  const colorScheme = useColorScheme();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <DatabaseProvider>
      <NavigationProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <StatusBar style="dark" translucent />
            <Stack screenOptions={{
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
              },
              headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerShown: false,
            }}>
              <Stack.Screen name="home" />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="language/[iso]" />
              <Stack.Screen name="language/[iso]/[list]" />
              <Stack.Screen name="language/[iso]/[list]/word/[uuid]" />
              <Stack.Screen name="language/[iso]/[list]/word/add_type" />
              <Stack.Screen name="language/[iso]/[list]/word/add_details" />
              <Stack.Screen name="language/[iso]/[list]/practice/study" />
              <Stack.Screen name="language/[iso]/[list]/practice/memorize" />
              <Stack.Screen name="add_lang" />
              <Stack.Screen
                name="settings"
                options={{
                  title: 'Settings',
                }}
              />
            </Stack>
          </PaperProvider>
        </SafeAreaProvider>
      </NavigationProvider>
    </DatabaseProvider>
  );
}