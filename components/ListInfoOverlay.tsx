import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import UnifiedDialog from './UnifiedDialog';
import { useAppTheme } from '@/styles/ThemeContext';
import i18n from '@/i18n';

const { width: screenWidth } = Dimensions.get('window');

interface InfoSlide {
  title: string;
  description: string;
  icon: string;
}

const slides: InfoSlide[] = [
  {
    title: i18n.t('status_indicator'),
    description: i18n.t('status_indicator_desc'),
    icon: 'square',
  },
  {
    title: i18n.t('proficiency_bar'),
    description: i18n.t('proficiency_bar_desc'),
    icon: 'chart-bar',
  },
  {
    title: i18n.t('add_words_info'),
    description: i18n.t('add_words_info_desc'),
    icon: 'plus',
  },
  {
    title: i18n.t('memorize_info'),
    description: i18n.t('memorize_info_desc'),
    icon: 'lightbulb',
  },
];

interface ListInfoOverlayProps {
  visible: boolean;
  onDismiss: () => void;
}

export const ListInfoOverlay: React.FC<ListInfoOverlayProps> = ({ visible, onDismiss }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { colors } = useAppTheme();

  const renderAnimatedDot = (index: number) => {
    const progress = scrollProgress - index;
    const scale = Math.max(0.6, 1 - Math.abs(progress) * 0.4);
    const opacity = Math.max(0.3, 1 - Math.abs(progress) * 0.7);
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.paginationDot,
          {
            backgroundColor: colors.primary,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  const renderSlide = ({ item }: { item: InfoSlide }) => (
    <View style={styles.slideContainer}>
      <View style={[styles.slide, { backgroundColor: colors.elevated }]}>
        <Text variant="headlineSmall" style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text variant="bodyLarge" style={[styles.description, { color: colors.text }]}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <UnifiedDialog
      visible={visible}
      onDismiss={onDismiss}
      title={i18n.t('help')}
      actions={
        <Button
          mode="contained"
          onPress={onDismiss}
          style={styles.button}
        >
          {i18n.t('got_it')}
        </Button>
      }
    >
      <View style={styles.container}>
        <Carousel
          loop={false}
          width={screenWidth - 80}
          height={300}
          data={slides}
          onSnapToItem={setCurrentIndex}
          onProgressChange={(_, absoluteProgress) => {
            setScrollProgress(absoluteProgress);
          }}
          renderItem={renderSlide}
          style={{ width: screenWidth - 80 }}
          pagingEnabled={true}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
        />
        <View style={styles.pagination}>
          {slides.map((_, index) => renderAnimatedDot(index))}
        </View>
      </View>
    </UnifiedDialog>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    minWidth: 120,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});