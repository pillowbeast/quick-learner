import * as React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { usePathname } from 'expo-router';

const window_width = Dimensions.get('window').width;
const window_height = Dimensions.get('window').height;

export default function BottomBar() {
  const pathname = usePathname();
  const isMemorize = pathname === '/language/memorize'

  return (
    <View style={styles.container}>
      {isMemorize && (
      <>
        <IconButton icon="chevron-left" onPress={() => {console.log("Left Arrow Pressed")}}/>
        <IconButton icon="pencil" onPress={() => {console.log("Pencil clicked")}}/>
        <IconButton icon="chevron-right" onPress={() => {console.log("Right Arrow Pressed")}}/>
      </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    width: window_width,
    backgroundColor: '#fff',
  },
});