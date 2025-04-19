import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';

interface BackButtonProps {
  style?: object;
  color?: string;
  size?: number;
  minDelay?: number;
}

export default function BackButton({ 
  style, 
  color = '#6B7280', 
  size = 24,
  minDelay = 140 // Default minimum delay of 200ms
}: BackButtonProps) {
  const { goBack } = useNavigationHelper();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setTimeout(() => {
      goBack();
      setIsLoading(false);
    }, minDelay);
  };

  return (
    <IconButton
      icon="arrow-left"
      iconColor={color}
      size={size}
      style={[styles.backButton, style]}
      onPress={handlePress}
      disabled={isLoading}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 28,
    left: 28,
    zIndex: 10,
  },
}); 