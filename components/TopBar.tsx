import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { Dimensions, StyleSheet } from 'react-native';

const window_width = Dimensions.get('window').width;
const window_height = Dimensions.get('window').height;

const TopBar = () => (
  <Appbar.Header style={styles.container}>
    <Appbar.BackAction onPress={() => {}} />
    <Appbar.Action icon="home" onPress={() => {}} />
  </Appbar.Header>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    top: 0,
    left: 0,
    flex: 1,
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'space-between',
    width: window_width,
    // height: 0.5*window_height,
  },
});

export default TopBar;