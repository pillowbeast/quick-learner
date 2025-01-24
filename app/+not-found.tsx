import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Link, Stack } from 'expo-router';
import { useNavigationHelper } from '@/hooks/useNavigation';

export default function NotFoundScreen() {
  const { goHomeReplace } = useNavigationHelper();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <Button mode="contained" onPress={goHomeReplace}>
          Go to Home
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
