import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '@/styles/ThemeContext';
import { radii, spacing, typography } from '@/styles/tokens';

interface UnifiedDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}

export default function UnifiedDialog({ visible, onDismiss, title, children, actions }: UnifiedDialogProps) {
  const { theme, colors } = useAppTheme();

  if (!visible) {
    return null;
  }
  
  return (
    <View style={styles.overlayFullScreen}>
      <Pressable onPress={onDismiss} style={styles.stretchScreen}>
        <BlurView style={[styles.stretchScreen, { paddingTop: 4.5*spacing.xxl }]} intensity={100} tint={theme === 'dark' ? 'dark' : 'light'}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.dialogContainer}>
            <View style={[styles.dialog, { backgroundColor: colors.muted }]}>
              <Text style={[styles.title, { color: colors.accent, fontSize: typography.header.fontSize, fontWeight: typography.header.fontWeight }]}>{title}</Text>
              <View style={styles.content}>
                {children}
              </View>
              <View style={styles.actions}>
                {actions}
              </View>
            </View>
          </Pressable>
        </BlurView>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayFullScreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  },
  stretchScreen: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '100%',
    maxHeight: '80%',
    padding: spacing.sm,
  },
  dialog: {
    borderRadius: radii.sm,
    padding: spacing.sm,
  },
  content: {
    marginTop: spacing.sm,
    marginLeft: spacing.sm,
    marginBottom: spacing.md,
    marginRight: spacing.sm,
    gap: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  title: {
    marginLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
});
