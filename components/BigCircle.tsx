import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'react-native';

export default function BigCircle({ backgroundColor = "red", imageSrc }: { backgroundColor?: string, imageSrc?: string }) {
  if (!imageSrc) {
    return (
    <View style={[styles.circle, { backgroundColor }]}>
    </View>
    );
  }

  return (
    <View style={[styles.circle, { backgroundColor }]}>
      <Image source={{ uri: imageSrc }} style={{ width: 100, height: 100 }} />
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