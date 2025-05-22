import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

import { useDatabase } from '@/hooks/useDatabase';
import { Word } from '@/hooks/database/types';
import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useWordSelection } from '@/hooks/useWordSelection';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { WordProperties, PropertyType } from '@/types/word';
import { logger } from '@/utils/logger';
import { languageConfigs } from '@/types/languages';
import BackButton from '@/components/BackButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

export default function MemorizePage() {
  const { state } = useNavigationContext();
  const { goToEditWord, goBack } = useNavigationHelper();
  const database = useDatabase();
  const config = languageConfigs[state.currentLanguage?.iso || 'en'] || languageConfigs.en;
  const params = useLocalSearchParams();
  const settings = params.settings ? JSON.parse(params.settings as string) : null;
  
  // Using refs for values that don't need to trigger re-renders
  const initialLoadCompleted = useRef(false);

  const [isRevealed, setIsRevealed] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [lastDirection, setLastDirection] = useState<number | null>(null);
  const [wordProperties, setWordProperties] = useState<Record<string, WordProperties>>({});
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentWord,
    remainingWords,
    totalFilteredWords,
    totalOriginalWords,
    handleSuccess,
    nextWord,
  } = useWordSelection({
    words,
    settings,
    onWordChange: () => {
      setIsRevealed(false);
    },
  });

  const loadWords = useCallback(async () => {
    if (!state.currentList?.uuid) return;

    try {
      setIsLoading(true);
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
      initialLoadCompleted.current = true;
    } catch (error) {
      logger.error('Error loading words for practice:', error);
    } finally {
      setIsLoading(false);
    }
  }, [state.currentList?.uuid, database]);

  // Check if we've reached the end of the words
  useEffect(() => {
    if (initialLoadCompleted.current && remainingWords === 0 && totalFilteredWords > 0) {
      logger.debug('No more words to practice, navigating back');
      // Add a small delay to ensure animations complete
      const timer = setTimeout(() => {
        goBack();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [remainingWords, totalFilteredWords, goBack]);

  // Add useFocusEffect to reload words when returning to this screen
  useFocusEffect(
    useCallback(() => {
      loadWords();
      return () => {
        initialLoadCompleted.current = false;
      };
    }, [loadWords])
  );

  // Handle database update and next word when shouldUpdate is true
  useEffect(() => {
    if (!shouldUpdate || lastDirection === null) return;
    
    const timeout = setTimeout(() => {
      const isSuccess = lastDirection > 0;
      handleSuccess(isSuccess);
      nextWord();
      setShouldUpdate(false);
      setLastDirection(null);
    }, 150);

    return () => clearTimeout(timeout);
  }, [shouldUpdate, lastDirection, handleSuccess, nextWord]);

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

  const handleEditPress = () => {
    if (currentWord) {
      goToEditWord(currentWord.uuid);
    }
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

  const getWordTypeConfig = (type: string) => {
    return config.wordTypes.find(wt => wt.type === type);
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper backgroundColor="#F8F9FA">
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-gray-500`}>Loading words...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (totalOriginalWords === 0) {
    return (
      <SafeAreaWrapper backgroundColor="#F8F9FA">
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-gray-500`}>No words available in this list</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!currentWord && totalFilteredWords > 0) {
    return (
      <SafeAreaWrapper backgroundColor="#F8F9FA">
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-gray-500`}>Loading...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  // If we have words but all were filtered out based on settings
  if (totalOriginalWords > 0 && totalFilteredWords === 0) {
    return (
      <SafeAreaWrapper backgroundColor="#F8F9FA">
        <View style={tw`flex-1 justify-center items-center p-6`}>
          <Text style={tw`text-lg text-gray-500 text-center mb-4`}>
            No words match your practice settings
          </Text>
          <Text style={tw`text-base text-gray-400 text-center`}>
            Try changing the word types or proficiency mode
          </Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  // Calculate the progress percentage
  const practiceProgress = totalFilteredWords > 0 
    ? ((totalFilteredWords - remainingWords) / totalFilteredWords) * 100 
    : 0;

  if (!currentWord) {
    return (
      <SafeAreaWrapper backgroundColor="#F8F9FA">
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-gray-500`}>Ready to start practice</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor="#F8F9FA">
      <BackButton color="black" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {remainingWords} {remainingWords === 1 ? 'word' : 'words'} remaining
            </Text>
          </View>
          <GestureDetector gesture={swipe_knowledge}>
            <Animated.View
              style={[
                styles.card,
                animatedStyle,
                currentWord?.type && { borderLeftWidth: 4, borderLeftColor: '#3B82F6' }
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
                        <>
                          {wordProperties[currentWord.uuid]?.article?.value && 
                            `${String(wordProperties[currentWord.uuid].article.value)} `
                          }
                          {currentWord.translation}
                          {wordProperties[currentWord.uuid]?.gender?.value && 
                            ` (${String(wordProperties[currentWord.uuid].gender.value)})`
                          }
                        </>
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
                    <TouchableOpacity
                      onPress={handleEditPress}
                      style={styles.editButtonContainer}
                    >
                      <IconButton
                        icon="pencil"
                        size={24}
                        style={styles.editButton}
                      />
                    </TouchableOpacity>
                  </>
                )}
                {!isRevealed && (
                  <Text style={styles.tapHint}>Tap to reveal</Text>
                )}
                {currentWord?.type && (
                  <View style={styles.typeIndicatorContainer}>
                    <View style={styles.typeIndicator}>
                      <IconButton
                        icon={getWordTypeConfig(currentWord.type)?.icon || 'help-circle'}
                        size={24}
                        iconColor="#3B82F6"
                        style={styles.typeIcon}
                      />
                      <Text style={styles.typeText}>{getWordTypeConfig(currentWord.type)?.type || ''}</Text>
                    </View>
                  </View>
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

          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${practiceProgress}%`,
                  backgroundColor: remainingWords === 0 ? '#10B981' : '#3B82F6'
                }
              ]} 
            />
            <Text style={styles.progressBarText}>
              {totalFilteredWords - remainingWords}/{totalFilteredWords} words practiced
              {totalFilteredWords !== totalOriginalWords && totalOriginalWords > 0 && (
                ` (out of ${totalOriginalWords} total)`
              )}
            </Text>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaWrapper>
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
    position: 'relative',
  },
  line: {
    height: 48,
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
  editButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  editButton: {
    margin: 0,
  },
  propertiesContainer: {
    marginTop: 8,
    margin: 8,
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
  progressContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#6B7280',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBarText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  typeIndicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  typeIndicator: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeIcon: {
    margin: 0,
  },
  typeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});