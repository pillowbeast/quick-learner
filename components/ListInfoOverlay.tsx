import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, Portal, Modal, Surface } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
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

  const renderSlide = ({ item }: { item: InfoSlide }) => (
    <Surface style={styles.slide}>
      <Text variant="headlineSmall" style={styles.title}>{item.title}</Text>
      <Text variant="bodyLarge" style={styles.description}>{item.description}</Text>
    </Surface>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <View style={styles.container}>
          <Carousel
            loop={false}
            width={screenWidth - 80}
            height={300}
            data={slides}
            onSnapToItem={setCurrentIndex}
            renderItem={renderSlide}
          />
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
          <View style={styles.controls}>
            <Button
              mode="contained"
              onPress={onDismiss}
              style={styles.button}
            >
              {i18n.t('got_it')}
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 0,
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    overflow: 'hidden',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
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
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#6200EE',
  },
});