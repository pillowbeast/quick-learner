import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import CountryFlag from "react-native-country-flag";


export default function Flag({ iso }: { iso: string }) {
  return (
    <View style={styles.container}>
      <CountryFlag isoCode={iso} size={25} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 100,
    backgroundColor: "#fff",
  },
});
