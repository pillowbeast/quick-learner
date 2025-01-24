import * as React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';

const window_width = Dimensions.get('window').width;
const window_height = Dimensions.get('window').height;

export default function BottomBar() {

  return (
    <View style={styles.container}>
      <Text>BottomBar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: window_width,
    backgroundColor: '#fff',
  },
});