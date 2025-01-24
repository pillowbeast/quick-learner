import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export default function ProfileMetaData() {
  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value=""
        onChangeText={() => {}}
        disabled={true}
      />
      <TextInput
        label="Password"
        value=""
        onChangeText={() => {}}
        disabled={true}
      />
      <TextInput
        label="Phone Number"
        value=""
        onChangeText={() => {}}
        disabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    height: 200,
  },
});