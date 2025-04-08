import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
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
