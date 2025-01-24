import React from 'react';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppHeader from '@/components/AppHeader';

export default function Login() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (username.trim() !== "") {
      await AsyncStorage.setItem("isLoggedIn", "true");
      router.replace("/home");
      console.log("Just logged you in");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AppHeader title="QuickLearner" subtitle='Welcome to' />
      <Text>Login</Text>
      <TextInput
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, width: 200, marginBottom: 20 }}
      />
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
      <Button mode="contained" onPress={handleLogin}>
        SignUp
      </Button>
      <Button mode="contained" onPress={handleLogin}>
        Continue with Google
      </Button>
      <Button mode="contained" onPress={handleLogin}>
        Continue with Facebook
      </Button>
    </View>
  );
}
