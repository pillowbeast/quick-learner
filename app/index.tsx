import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InitialScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkNavigation = async () => {
      await AsyncStorage.clear(); // 🚨 Debugging, remove before production

      const previouslyVisited = await AsyncStorage.getItem("previouslyVisited");
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

      console.log("Has Visited?", previouslyVisited);
      console.log("Is Logged In?", isLoggedIn);

      if (!previouslyVisited) {
        console.log("Redirecting to Landing");
        router.replace("/auth/landing");
      } else if (!isLoggedIn) {
        console.log("Redirecting to Login");
        router.replace("/auth/login");
      } else {
        console.log("Redirecting to Home");
        router.replace("/home");
      }

      setChecking(false); // Stops loading
    };

    checkNavigation();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null; // Prevents extra rendering after navigation
}
