import { StyleSheet, View, Dimensions } from 'react-native';

export default function BigCircle({ backgroundColor = "red" }) {
  return (
    <View style={[styles.circle, { backgroundColor }]}>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 0.3*Dimensions.get('window').width,
    height: 0.3*Dimensions.get('window').width,
    borderRadius: 0.15*Dimensions.get('window').width, // Half of the width/height to make it a circle
    backgroundColor: 'blue',
  },
});