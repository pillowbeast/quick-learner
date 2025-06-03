import React, { ReactNode } from 'react';
import { View, StyleSheet, Animated, I18nManager } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { IconButton, Text } from 'react-native-paper';
import i18n from '@/i18n';
import { useAppTheme } from '@/styles/ThemeContext';

interface SwipeableWordCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void; // For Edit
  onSwipeRight?: () => void; // For Delete
  swipeableRef?: React.RefObject<Swipeable | null>; // Allow Swipeable or null for the ref
}

export default function SwipeableWordCard({ children, onSwipeLeft, onSwipeRight, swipeableRef }: SwipeableWordCardProps) {
  const { colors } = useAppTheme();

  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: I18nManager.isRTL ? [-101, -100, -50, 0] : [0, 50, 100, 101],
      outputRange: I18nManager.isRTL ? [-1, 0, 0, 20] : [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });
    // Edit Action
    return (
      <RectButton 
        style={[
            I18nManager.isRTL ? styles.rightAction : styles.leftAction, 
            { backgroundColor: colors.primary }
        ]} 
        onPress={() => {
            onSwipeLeft?.();
            swipeableRef?.current?.close();
        }}>
        <Animated.View style={[styles.actionContent, { transform: [{ translateX: trans }] }]}>
            <IconButton icon="pencil" iconColor={colors.text} size={20} style={styles.actionIcon}/>
            <Text style={[styles.actionText, {color: colors.text}]}>{i18n.t('edit_word')}</Text>
        </Animated.View>
      </RectButton>
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
        inputRange: I18nManager.isRTL ? [0, 50, 100, 101] : [-101, -100, -50, 0],
        outputRange: I18nManager.isRTL ? [-20, 0, 0, 1] : [-1, 0, 0, 20],
        extrapolate: 'clamp',
    });
    // Delete Action
    return (
      <RectButton 
        style={[
            I18nManager.isRTL ? styles.leftAction : styles.rightAction, 
            { backgroundColor: colors.accent }
        ]} 
        onPress={() => {
            onSwipeRight?.();
            swipeableRef?.current?.close();
        }}>
        <Animated.View style={[styles.actionContent, { transform: [{ translateX: trans }] }]}>
            <IconButton icon="delete" iconColor={colors.text} size={20} style={styles.actionIcon}/>
            <Text style={[styles.actionText, {color: colors.text}]}>{i18n.t('delete')}</Text>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions} 
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={(direction) => {
        // This callback is preferred for triggering actions as it fires before the row settles open.
        // The onSwipeableOpen can sometimes feel a bit delayed.
        if (direction === 'left' && onSwipeLeft) {
            // onSwipeLeft(); // Action triggered by RectButton onPress
        } else if (direction === 'right' && onSwipeRight) {
            // onSwipeRight(); // Action triggered by RectButton onPress
        }
      }}
      friction={1.5}
      leftThreshold={80}
      rightThreshold={80}
      overshootFriction={8}
      containerStyle={styles.swipeableContainer} // Added for margin consistency
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeableContainer: {
    marginVertical: 8, // Match card's vertical margin from entryStyles
    borderRadius: 12, // Match card's borderRadius
    overflow: 'hidden', // Ensures actions are clipped by borderRadius
  },
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
    paddingHorizontal: 20,
    // marginVertical and borderRadius are handled by swipeableContainer
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
    paddingHorizontal: 20,
    // marginVertical and borderRadius are handled by swipeableContainer
  },
  actionContent: {
    alignItems: 'center',
    flexDirection: 'row' // Keep icon and text in a row
  },
  actionIcon: {
    margin: 0, // Remove default margins from IconButton
  },
  actionText: {
    fontSize: 14,
    marginLeft: I18nManager.isRTL ? 0 : 5, // Add space between icon and text
    marginRight: I18nManager.isRTL ? 5 : 0,
    fontWeight: '600'
  }
}); 