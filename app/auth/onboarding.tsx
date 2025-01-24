import React, { useState } from 'react';
import { View, Image, Dimensions, StyleSheet, Pressable } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Text, Button } from 'react-native-paper';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from '@/components/AppHeader';

const { width } = Dimensions.get('window');

const tooltips = [
  {
    title: "Find My Item",
    description: "Search for the item attached to the HiRemote.",
    image: require('@/assets/images/emoji1.png'),
  },
  {
    title: "Camera Shutter",
    description: "Use the shutter button on your HiRemote to snap pics.",
    image: require('@/assets/images/emoji2.png'),
  },
  {
    title: "Voice Memos",
    description: "You easily can store, rename or delete your audio file.",
    image: require('@/assets/images/emoji3.png'),
  }
];

export default function LandingPage() {
  // Navigation
  const router = useRouter();
  console.log("Landing Page Loaded");

  const handleContinue = async () => {
    await AsyncStorage.setItem("previouslyVisited", "true");
    console.log("Navigating to Login...");
    router.replace("/auth/login"); // ✅ Use absolute path
  };

  // Tooltip Carousel
  const [index, setIndex] = useState(0);

  const leftTip = () => {
    if (index < tooltips.length - 1) {
      setIndex(index + 1);
    }
  };

  const rightTip = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <GestureRecognizer
    onSwipeLeft={leftTip}
    onSwipeRight={rightTip}
    style={styles.container}
  >
    <AppHeader />
    <View style={styles.circle}>
      <Image source={tooltips[index].image} style={styles.image} />
    </View>
    <Text>{tooltips[index].title}</Text>
    <Text>{tooltips[index].description}</Text>

    <View style={styles.dotsContainer}>
      {tooltips.map((_, i) => (
        <View key={i} style={[styles.dot, index === i && styles.activeDot]} />
      ))}
    </View>

    <Button  mode="contained" onPress={handleContinue}>
      Get Started
    </Button>
  </GestureRecognizer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#A2E3A1', // Adjust background color
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  bigtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#5E1916',
  },
  button: {
    marginTop: 20,
    width: width * 0.8,
  },
  circle: {
    width: '30%',
    height: 0.3*Dimensions.get('window').width,
    borderRadius: 0.5*Dimensions.get('window').width, // Half of the width/height to make it a circle
    backgroundColor: 'blue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
