import React from "react";
import { View, Text } from "react-native";
import { Avatar } from "react-native-paper";

import TopBar from "@/components/TopBar";
import ProfileMetaData from "@/components/ProfileMetaData";
import BottomBar from "@/components/BottomBar";

export default function Settings() {
  return (
    <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
      <TopBar />
      <Text>👤 Profile Page</Text>
      <Avatar.Image size={256} source={{ uri: "https://avatars.githubusercontent.com/u/44303315?v=4" }} />
      <ProfileMetaData />
      <BottomBar />
    </View>
  );
}
