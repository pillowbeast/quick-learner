import React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Text>Login</Text>
      <TextInput
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, width: 200, marginBottom: 20 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
