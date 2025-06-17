import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useNavigationHelper } from '@/hooks/useNavigation';
import { useAppTheme } from '@/styles/ThemeContext';
import { typography, spacing, radii } from '@/styles/tokens';

const UnifiedFooter = () => {
  const { goToSettings, goToOnboarding } = useNavigationHelper();
  const { theme, toggleTheme, colors } = useAppTheme();

  return (
    <View>
      <View style={[styles.footerContainer, { backgroundColor: colors.background }]}>
        <Text style={[typography.caption, { color: colors.text }]}>by Yannik Werner</Text>
        <IconButton
          icon={theme === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
          iconColor={colors.secondary}
          size={20}
          onPress={toggleTheme}
          accessibilityLabel="Toggle theme"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UnifiedFooter; 