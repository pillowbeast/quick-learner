import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { NavigationProvider } from '@/hooks/useNavigationContext';
import { DatabaseProvider } from '@/hooks/useDatabase';
import { ThemeProvider } from "@/styles/ThemeContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <DatabaseProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <NavigationProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{
                headerShown: false,
              }}>
                <Stack.Screen name="home" />
                <Stack.Screen name="onboarding" />
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
            </NavigationProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});