import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export default function ProfileMetaData() {
  return (
    <View style={styles.container}>
      <Text>Profile MetaData</Text>
      <TextInput
        label="Email"
        value=""
        onChangeText={() => {}}
        disabled={true}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value=""
        onChangeText={() => {}}
        disabled={true}
        style={styles.input}
      />
      <TextInput
        label="Phone Number"
        value=""
        onChangeText={() => {}}
        disabled={true}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    height: 200,
    width: "80%",
    backgroundColor: "lightgrey",
    padding: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
  },
});