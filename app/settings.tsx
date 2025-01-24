import React from "react";
import { View, Text } from "react-native";

import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";

export default function Settings() {
  return (
    <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
      <TopBar />
      <Text>⚙️ Settings Page</Text>
      <BottomBar />
    </View>
  );
}
