import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '@/styles/ThemeContext';

interface UnifiedDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}

export default function UnifiedDialog({ visible, onDismiss, title, children, actions }: UnifiedDialogProps) {
  const { colors } = useAppTheme();

  if (!visible) {
    return null;
  }
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <Pressable onPress={onDismiss} style={styles.container}>
        <BlurView style={styles.absolute} intensity={30} tint="dark" />
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={[styles.dialog, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.title, { color: colors.accent }]}>{title}</Text>
            <View style={styles.content}>
              {children}
            </View>
            <View style={styles.actions}>
              {actions}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});
