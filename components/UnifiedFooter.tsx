import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';

const UnifiedFooter = () => {
  const { goToSettings } = useNavigationHelper();

  return (
    <View>
      <View style={styles.bottomBorder} />
      <View style={styles.footerContainer}>
        <Text style={[styles.text]}>Impressum / About</Text>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  bottomBorder: {
    height: 1,
    backgroundColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footerContainer: {
    paddingTop: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
  },
});

export default UnifiedFooter; 