import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';

import i18n from '@/i18n';
import { useNavigationHelper } from '@/hooks/useNavigation';
import DisplayLanguageSelector from '@/components/DisplayLanguageSelector';
import { useAppTheme } from '@/styles/ThemeContext';
import { typography, spacing, radii } from '@/styles/tokens';

interface UnifiedHeaderProps {
  title: string;
  actions?: ReactNode;
  backButton?: boolean;
  settingsButton?: boolean;
}

export default function UnifiedHeader({ title = 'Title', actions = <></>, backButton = true, settingsButton = true }: UnifiedHeaderProps) {
  const { goToOnboarding, goToSettings, goBack } = useNavigationHelper();
  const { theme, colors } = useAppTheme();

  return (
    <View>
      <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
        <View style={styles.topRowContainer}>
          {backButton ? (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={goBack}
              iconColor={colors.secondary}
            />
          ) : (
            <View/>
          )}
          {settingsButton && (
            <IconButton
              icon="cog"
              size={24}
              onPress={goToSettings}
                iconColor={colors.secondary}
              />
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={[typography.header, { color: colors.primary }]}>{title}</Text>
        </View>
        {actions && (
          <View style={styles.actionsContainer}>
            {actions}
          </View>
        )}
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    minHeight: 40,
  },
}); 