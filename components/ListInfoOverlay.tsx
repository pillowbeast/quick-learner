import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, Portal, Modal, Surface } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

interface InfoSlide {
  title: string;
  description: string;
  icon: string;
}

const slides: InfoSlide[] = [
  {
    title: 'Status Indicator',
    description: 'The small square shows your last answer:\n• Gray: Not answered yet\n• Red: Last answer was wrong\n• Green: Last answer was correct',
    icon: 'square',
  },
  {
    title: 'Proficiency Bar',
    description: 'The bar shows your overall progress:\n• Red to Gray: 0% to 50% proficiency\n• Gray to Green: 50% to 100% proficiency\n• Width shows your current level',
    icon: 'chart-bar',
  },
  {
    title: 'Add Words',
    description: 'Use the + button to add new words to your list. You can add words one by one or import them in bulk.',
    icon: 'plus',
  },
  {
    title: 'Memorize',
    description: 'The lightbulb button starts a memorization session where you can practice your words and improve your proficiency.',
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
              Got it!
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