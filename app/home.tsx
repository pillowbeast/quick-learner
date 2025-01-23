import React from "react";
import { View, Text, Pressable } from "react-native";
import { Button } from "react-native-paper";

import TopBar from "@/components/TopBar";
import AppHeader from "@/components/AppHeader";
import BigCircle from "@/components/BigCircle";

export default function Home() {
  return (
    <View style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <TopBar />

      <AppHeader title="QuickLearner" subtitle="" />
      <BigCircle backgroundColor="red" />

      <Button mode="contained" onPress={() => console.log("Button Pressed")}>
        Getting Started
      </Button>
    </View>
  );
}
