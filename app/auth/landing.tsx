import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LandingPage() {
  const router = useRouter();
  console.log("Landing Page Loaded");

  const handleContinue = async () => {
    await AsyncStorage.setItem("previouslyVisited", "true");
    console.log("Navigating to Login...");
    router.replace("/auth/login"); // ✅ Use absolute path
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Quick Learner!</Text>
      <Button title="Get Started" onPress={handleContinue} />
    </View>
  );
}
