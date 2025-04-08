import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
  Extrapolate,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import tw from 'twrnc';

import { useDatabase } from '@/hooks/useDatabase';
import { Word } from '@/hooks/database/types';
import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useWordSelection } from '@/hooks/useWordSelection';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { WordProperties, PropertyType } from '@/types/word';
import { logger } from '@/utils/logger';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

export default function MemorizePage() {
  const { state, setCurrentList } = useNavigationContext();
  const { goToEditWord, goBack } = useNavigationHelper();
  const database = useDatabase();

  const [isRevealed, setIsRevealed] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [lastDirection, setLastDirection] = useState<number | null>(null);
  const [wordProperties, setWordProperties] = useState<Record<string, WordProperties>>({});

  const {
    currentWord,
    currentIndex,
    handleSuccess,
    nextWord,
  } = useWordSelection({
    words,
    onWordChange: (word) => {
      setIsRevealed(false);
    },
  });

  useEffect(() => {
    // Check if we've reached the end of the words
    if (words.length > 0 && currentIndex >= words.length) {
      // Navigate back to the list
      goBack();
    }
  }, [currentIndex, words.length]);

  useEffect(() => {
    const loadWords = async () => {
      if (!state.currentLanguage?.uuid || !state.currentList?.uuid) return;

      const loadedWords = await database.getWordsByList(state.currentList.uuid);
      setWords(loadedWords);
      logger.debug(`Loaded ${loadedWords.length} words for list ${state.currentList.uuid}`);

      // Load properties for all words
      const properties: Record<string, WordProperties> = {};
      for (const word of loadedWords) {
        const wordProps = await database.getWordProperties(word.uuid);
        const formattedProperties: WordProperties = {};
        
        for (const prop of wordProps) {
          if (prop.type === 'conjugation') {
            formattedProperties[prop.name] = {
              name: prop.name,
              value: JSON.parse(prop.value),
              type: 'conjugation'
            };
            console.log(formattedProperties);
          } else {
            formattedProperties[prop.name] = {
              name: prop.name,
              value: prop.value,
              type: prop.type as PropertyType
            };
          }
        }
        
        properties[word.uuid] = formattedProperties;
      }
      setWordProperties(properties);
    };
    loadWords();
  }, [state.currentLanguage?.uuid, state.currentList?.uuid]);

  // Handle database update and next word when shouldUpdate is true
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (shouldUpdate && lastDirection !== null) {
        const isSuccess = lastDirection > 0;
        handleSuccess(isSuccess);
        nextWord();
        setShouldUpdate(false);
        setLastDirection(null);
      }
    }, 150);

    return () => clearTimeout(timeout);
  }, [shouldUpdate, lastDirection]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const scale = useSharedValue(1);
  const checkmarkOpacity = useSharedValue(0);
  const crossOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-30, 0, 30],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, width / 2],
      [1, 0],
      Extrapolate.CLAMP
    );

    checkmarkOpacity.value = interpolate(
      translateX.value,
      [0, width / 4],
      [0, 1],
      Extrapolate.CLAMP
    );
    crossOpacity.value = interpolate(
      translateX.value,
      [-width / 4, 0],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotate}deg` },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: checkmarkOpacity.value,
      transform: [
        { scale: interpolate(checkmarkOpacity.value, [0, 1], [0.5, 1], Extrapolate.CLAMP) }
      ],
    };
  });

  const crossStyle = useAnimatedStyle(() => {
    return {
      opacity: crossOpacity.value,
      transform: [
        { scale: interpolate(crossOpacity.value, [0, 1], [0.5, 1], Extrapolate.CLAMP) }
      ],
    };
  });

  const swipe_knowledge = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotateZ.value = (event.translationX / width) * 20;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = Math.sign(event.translationX);
        
        // Set the direction and reset reveal immediately
        runOnJS(setLastDirection)(direction);
        runOnJS(setIsRevealed)(false);
        runOnJS(setShouldUpdate)(true);

        // Start animation after 100ms
        translateX.value = withDelay(100, withSpring(0, { damping: 100, stiffness: 300 }));
        translateY.value = withDelay(100, withSpring(0, { damping: 100, stiffness: 300 }));
        rotateZ.value = withDelay(100, withSpring(0, { damping: 100, stiffness: 300 }));
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 600 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 600 });
        rotateZ.value = withSpring(0, { damping: 20, stiffness: 600 });
      }
    });

  const handleTap = () => {
    setIsRevealed(!isRevealed);
    logger.debug(`Tapped on word ${currentWord?.word}`);
  };

  const renderProperties = (properties: WordProperties) => {
    return Object.entries(properties).map(([name, prop]) => {
      if (prop.type === 'conjugation') {
        const value = prop.value as Record<string, string>;
        return (
          <View key={name} style={styles.propertyContainer}>
            <Text style={styles.propertyLabel}>{name}:</Text>
            {Object.entries(value).map(([person, val]) => (
              <Text key={person} style={styles.propertyValue}>
                {person}: {val}
              </Text>
            ))}
          </View>
        );
      } else {
        return (
          <View key={name} style={styles.propertyContainer}>
            <Text style={styles.propertyLabel}>{name}:</Text>
            <Text style={styles.propertyValue}>{prop.value as string}</Text>
          </View>
        );
      }
    });
  };

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-gray-500`}>No words available in this list</Text>
        </View>
      </View>
    );
  }

  if (!currentWord) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.content}>
        <GestureDetector gesture={swipe_knowledge}>
          <Animated.View
            style={[
              styles.card,
              animatedStyle,
            ]}
          >
            <TouchableOpacity
              onPress={handleTap}
              style={styles.cardContent}
            >
              <View style={styles.line}>
                <Text style={styles.wordText}>
                  {currentWord.word}
                </Text>
              </View>
              {isRevealed && (
                <>
                  <View style={styles.line}>
                    <Text style={styles.translationText}>
                      {currentWord.type === 'noun' && wordProperties[currentWord.uuid]?.gender?.value ? (
                        <>
                          {String(wordProperties[currentWord.uuid].gender.value)}{' '}
                          {currentWord.translation}
                          {' '}({String(wordProperties[currentWord.uuid].gender.value)})
                        </>
                      ) : (
                        currentWord.translation
                      )}
                    </Text>
                  </View>
                  {currentWord.example && (
                    <View style={styles.line}>
                      <Text style={styles.exampleText}>{currentWord.example}</Text>
                    </View>
                  )}
                  {wordProperties[currentWord.uuid] && (
                    <View style={styles.propertiesContainer}>
                      {renderProperties(wordProperties[currentWord.uuid])}
                    </View>
                  )}
                  <IconButton
                    icon="pencil"
                    size={24}
                    onPress={() => goToEditWord(currentWord.uuid)}
                    style={styles.editButton}
                  />
                </>
              )}
              {!isRevealed && (
                <Text style={styles.tapHint}>Tap to reveal</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>

        <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
          <MaterialIcons name="check" size={80} color="#6B7280" />
        </Animated.View>

        <Animated.View style={[styles.crossContainer, crossStyle]}>
          <MaterialIcons name="close" size={80} color="#6B7280" />
        </Animated.View>
      </View>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    padding: 20,
  },
  cardContent: {
    flex: 1,
    paddingTop: 16,
    paddingLeft: 12,
  },
  line: {
    height: 42,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 8,
    justifyContent: 'flex-end',
    paddingBottom: 4,
    paddingLeft: 8,
  },
  wordText: {
    fontSize: 18,
    lineHeight: 24,
  },
  translationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B5563',
    lineHeight: 48,
  },
  exampleText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  tapHint: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },
  checkmarkContainer: {
    position: 'absolute',
    right: 40,
    top: '50%',
    transform: [{ translateY: -40 }],
  },
  crossContainer: {
    position: 'absolute',
    left: 40,
    top: '50%',
    transform: [{ translateY: -40 }],
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  propertiesContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 4,
  },
  propertyContainer: {
    marginBottom: 8,
  },
  propertyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  propertyValue: {
    fontSize: 14,
    opacity: 0.8,
  },
});