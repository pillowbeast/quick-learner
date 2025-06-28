import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Link, Stack } from 'expo-router';

import { useNavigationHelper } from '@/hooks/useNavigation';
import { useAppTheme } from '@/styles/ThemeContext';
import UnifiedButton from '@/components/UnifiedButton';
import i18n from '@/i18n';

export default function NotFoundScreen() {
  const { goHomeReplace } = useNavigationHelper();
  const { colors } = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <UnifiedButton onPress={goHomeReplace} style={{backgroundColor: colors.accent}} textStyle={{color: colors.text}}>
          {i18n.t('go_to_home')}
        </UnifiedButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
