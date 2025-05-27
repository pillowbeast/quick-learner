import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';
import DisplayLanguageSelector from '@/components/DisplayLanguageSelector';
import i18n from '@/i18n';

interface UnifiedHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function UnifiedHeader({ title, actions }: UnifiedHeaderProps) {
  const { goOnboarding, goToSettings, goBack } = useNavigationHelper();

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <IconButton
            icon="cog"
            size={24}
            onPress={goToSettings}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text variant="headlineMedium" style={styles.title}>{title}</Text>
        </View>
        <View style={styles.topRow}>
          <IconButton
            icon="help-circle"
            size={20}
            onPress={goOnboarding}
          />
          
        </View>
        {actions && (
          <View style={styles.actionsContainer}>
            {actions}
          </View>
        )}
      </View>
      <View style={styles.bottomBorder} />
    </View>

  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10, // Adjust as needed, considering safe area
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderTopWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
    marginLeft: -8, // To align with padding
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Or 'space-around' / 'flex-end' depending on desired layout
    alignItems: 'center',
    marginTop: 8,
    minHeight: 40, // Ensure consistent height even if empty
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 