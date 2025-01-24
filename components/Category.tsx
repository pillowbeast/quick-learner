import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Category( { name }: {name: string} ) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 100,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
  },
});