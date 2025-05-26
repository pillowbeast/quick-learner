import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';

const ONBOARDING_KEY = '@quick_learner_onboarding_complete';

export default function Index() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(value === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasSeenOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Show nothing while checking onboarding status
  if (hasSeenOnboarding === null) {
    return null;
  }

  // Redirect based on onboarding status
  return <Redirect href={hasSeenOnboarding ? "/home" : "/onboarding" as any} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    backgroundColor: '#666',
  },
});
