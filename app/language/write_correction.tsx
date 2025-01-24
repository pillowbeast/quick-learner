import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import AppHeader from '@/components/AppHeader';
import TopBar from '@/components/TopBar';
import BottomBar from '@/components/BottomBar';

export default function WriteCorrectionPage() {
  return (
    <View style={styles.container}>
        <TopBar />
        <AppHeader title='QuickLearner' subtitle='' />
        <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});