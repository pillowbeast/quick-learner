import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useAppTheme } from '@/styles/ThemeContext';

const UnifiedFooter = () => {
  const { goToSettings, goToOnboarding } = useNavigationHelper();
  const { theme, toggleTheme, colors } = useAppTheme();

  return (
    <View>
      <View style={styles.bottomBorder} />
      <View style={styles.footerContainer}>
        <Text style={[styles.text]}>Impressum / About</Text>
        <IconButton
          icon={theme === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
          size={20}
          onPress={toggleTheme}
          accessibilityLabel="Toggle theme"
        />
        <View style={styles.bottomRow}>
          <IconButton
            icon="help-circle"
            size={20}
            onPress={goToOnboarding}
            iconColor={colors.text}
          />
        </View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});

export default UnifiedFooter; 