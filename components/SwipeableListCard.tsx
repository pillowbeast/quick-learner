import React, { ReactNode } from 'react';
import { StyleSheet, I18nManager, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { IconButton, Text, useTheme } from 'react-native-paper';
import i18n from '@/i18n';
import Animated, { SharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';

interface SwipeableListCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeableRef?: React.RefObject<SwipeableMethods | null>;
}

export default function SwipeableListCard({ children, onSwipeLeft, onSwipeRight, swipeableRef }: SwipeableListCardProps) {
  const theme = useTheme();

  const renderLeftActions = (progress: SharedValue<number>, dragX: SharedValue<number>, swipeableMethods: SwipeableMethods) => {
    const animatedStyle = useAnimatedStyle(() => {
      const trans = interpolate(
        dragX.value,
        I18nManager.isRTL ? [-101, -100, -50, 0] : [0, 50, 100, 101],
        I18nManager.isRTL ? [-1, 0, 0, 20] : [-20, 0, 0, 1],
        Extrapolate.CLAMP
      );
      return {
        transform: [{ translateX: trans }],
      };
    });
    return (
      <RectButton 
        style={[
            I18nManager.isRTL ? styles.rightAction : styles.leftAction, 
            { backgroundColor: theme.colors.primary }
        ]} 
        onPress={() => {
            onSwipeLeft?.();
            swipeableMethods.close();
        }}>
        <Animated.View style={[styles.actionContent, animatedStyle]}>
            <IconButton icon="pencil" iconColor={theme.colors.onPrimary} size={20} style={styles.actionIcon}/>
            <Text style={[styles.actionText, {color: theme.colors.onPrimary}]}>{i18n.t('edit_list')}</Text>
        </Animated.View>
      </RectButton>
    );
  };

  const renderRightActions = (progress: SharedValue<number>, dragX: SharedValue<number>, swipeableMethods: SwipeableMethods) => {
    const animatedStyle = useAnimatedStyle(() => {
      const trans = interpolate(
        dragX.value,
        I18nManager.isRTL ? [0, 50, 100, 101] : [-101, -100, -50, 0],
        I18nManager.isRTL ? [-20, 0, 0, 1] : [-1, 0, 0, 20],
        Extrapolate.CLAMP
      );
      return {
        transform: [{ translateX: trans }],
      };
    });
    return (
      <RectButton 
        style={[
            I18nManager.isRTL ? styles.leftAction : styles.rightAction, 
            { backgroundColor: theme.colors.error }
        ]} 
        onPress={() => {
            onSwipeRight?.();
            swipeableMethods.close();
        }}>
        <Animated.View style={[styles.actionContent, animatedStyle]}>
            <IconButton icon="delete" iconColor={theme.colors.onError} size={20} style={styles.actionIcon}/>
            <Text style={[styles.actionText, {color: theme.colors.onError}]}>{i18n.t('delete')}</Text>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      friction={1.5}
      leftThreshold={80}
      rightThreshold={80}
      overshootFriction={8}
      containerStyle={styles.swipeableContainer}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  swipeableContainer: {
    marginVertical: 8, 
    borderRadius: 12, 
    overflow: 'hidden', 
  },
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
    paddingHorizontal: 20,
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
    paddingHorizontal: 20,
  },
  actionContent: {
    alignItems: 'center',
    flexDirection: 'row' 
  },
  actionIcon: {
    margin: 0, 
  },
  actionText: {
    fontSize: 14,
    marginLeft: I18nManager.isRTL ? 0 : 5, 
    marginRight: I18nManager.isRTL ? 5 : 0,
    fontWeight: '600'
  }
}); 