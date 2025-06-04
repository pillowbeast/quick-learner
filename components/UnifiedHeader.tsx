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
}

export default function UnifiedHeader({ title, actions }: UnifiedHeaderProps) {
  const { goToOnboarding, goToSettings, goBack } = useNavigationHelper();
  const { theme, colors } = useAppTheme();

  return (
    <View>
      <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
        <View style={styles.topRowContainer}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={goBack}
            iconColor={colors.secondary}
          />
          <IconButton
            icon="cog"
            size={24}
            onPress={goToSettings}
            iconColor={colors.secondary}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>
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
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.header.fontSize,
    fontWeight: typography.header.fontWeight,
    textAlign: 'left',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    minHeight: 40,
  },
  bottomRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
}); 