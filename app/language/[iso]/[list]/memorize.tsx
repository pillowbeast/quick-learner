import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import TopBar from '@/components/TopBar';
import BottomBar from '@/components/BottomBar';

export default function MemorizePage() {
  const [pressed, setPressed] = React.useState(false);

  return (
    <View style={styles.container}>
      <TopBar />
      <Pressable style={styles.pressable} onPress={() => {setPressed(!pressed), console.log("Pressed", pressed)}}>
        <Text>Term</Text>
      </Pressable>
      <BottomBar />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pressable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});