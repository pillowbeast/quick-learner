import React from "react";
import { View, Text, Pressable } from "react-native";
import { Button } from "react-native-paper";

import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";
import AppHeader from "@/components/AppHeader";
import BigCircle from "@/components/BigCircle";
import LanguageSelector from "@/components/LanguageSelector";

export default function Home() {
  return (
    <View style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <TopBar />
      <AppHeader title="QuickLearner" subtitle="" />
      <BigCircle backgroundColor="red" />
      <LanguageSelector country_lists={["English", "Spanish", "German"]} />
      <BottomBar />
    </View>
  );
}
