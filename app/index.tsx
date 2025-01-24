import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
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

      setTimeout(() => {
        if (!previouslyVisited) {
          console.log("Redirecting to Onboarding");
          router.replace("/auth/onboarding");
        } else if (!isLoggedIn) {
          console.log("Redirecting to Login");
          router.replace("/auth/login");
        } else {
          console.log("Redirecting to Home");
          router.replace("/home");
        }

        setChecking(false); // Stops loading
      }, 1000); // Wait for 1 second
    };

    checkNavigation();
    
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={MD2Colors.pinkA200} />
      </View>
    );
  }

  return null; // Prevents extra rendering after navigation
}
