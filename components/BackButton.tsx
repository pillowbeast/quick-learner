import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackButtonProps {
  style?: object;
  color?: string;
  size?: number;
  minDelay?: number;
  offsetTop?: number;
  offsetLeft?: number;
}

export default function BackButton({ 
  style, 
  color = '#6B7280', 
  size = 32,
  minDelay = 140, // Default minimum delay of 140ms
  offsetTop = 29,
  offsetLeft = 20
}: BackButtonProps) {
  const { goBack } = useNavigationHelper();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

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
      style={[
        styles.backButton, 
        { 
          top: insets.top + offsetTop,
          left: insets.left + offsetLeft,
        },
        style
      ]}
      onPress={handlePress}
      disabled={isLoading}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
  },
}); 