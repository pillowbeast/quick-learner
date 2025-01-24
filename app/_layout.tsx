import React, { useEffect } from "react";
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { setupDatabase } from "@/hooks/useDatabase";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    setupDatabase().catch(console.error); // Initialize database on startup
  }, []);

  return (
    <SafeAreaProvider>
        <PaperProvider>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" />
          </Stack>
        </PaperProvider>
    </SafeAreaProvider>
  );
}
