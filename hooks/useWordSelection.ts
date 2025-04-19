import { useState, useCallback, useMemo } from 'react';
import { Word } from './database/types';
import { useDatabase } from './useDatabase';
import { logger } from '@/utils/logger';

interface PracticeSettings {
  wordCount: number;
  proficiencyMode: 'all' | 'unknown' | 'known';
  wordTypes: string[];
  useSpacedRepetition: boolean;
  targetProficiency: number;
}

interface UseWordSelectionProps {
  words: Word[];
  onWordChange?: (word: Word) => void;
  settings?: PracticeSettings;
}

interface UseWordSelectionReturn {
  currentWord: Word | null;
  remainingWords: number;
  handleSuccess: (success: boolean) => Promise<void>;
  nextWord: () => void;
}

function calculateWordScore(word: Word, useSpacedRepetition: boolean): number {
  const now = new Date();
  const lastSeen = word.lastSeen ? new Date(word.lastSeen) : new Date(0);
  const hoursSinceLastSeen = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60);
  
  // Base score starts at 100
  let score = 100;
  
  // Reduce score based on proficiency (lower proficiency = higher priority)
  score -= word.proficiency;
  
  // If spaced repetition is enabled, consider time since last seen
  if (useSpacedRepetition) {
    score += hoursSinceLastSeen * 0.1;
  }
  
  // Reduce score based on times answered (more times = lower priority)
  score -= word.timesAnswered * 0.5;
  
  // If word is marked as known, reduce its priority
  if (word.isKnown) {
    score -= 50;
  }
  
  return Math.max(0, score);
}

export function useWordSelection({ words, onWordChange, settings }: UseWordSelectionProps): UseWordSelectionReturn {
  const [activeWords, setActiveWords] = useState<Word[]>([]);
  const database = useDatabase();

  // Initialize active words when words array or settings change
  useMemo(() => {
    if (words.length === 0) return;
    
    // Filter words based on settings
    let filteredWords = [...words];
    
    if (settings) {
      // Filter by proficiency mode
      if (settings.proficiencyMode === 'known') {
        filteredWords = filteredWords.filter(word => word.isKnown);
      } else if (settings.proficiencyMode === 'unknown') {
        filteredWords = filteredWords.filter(word => !word.isKnown);
      }
      
      // Filter by word types
      if (settings.wordTypes.length > 0) {
        filteredWords = filteredWords.filter(word => 
          word.type && settings.wordTypes.includes(word.type)
        );
      }

      // Calculate scores for each word
      const scoredWords = filteredWords.map(word => ({
        word,
        score: calculateWordScore(word, settings.useSpacedRepetition),
        // Calculate how close the word's proficiency is to the target
        proficiencyDiff: Math.abs(word.proficiency - settings.targetProficiency)
      }));

      // Sort by score and proficiency difference
      scoredWords.sort((a, b) => {
        // First sort by score (higher score = higher priority)
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        // Then sort by how close to target proficiency
        return a.proficiencyDiff - b.proficiencyDiff;
      });

      // Take the top N words
      filteredWords = scoredWords
        .slice(0, settings.wordCount)
        .map(sw => sw.word);
    }
    
    setActiveWords(filteredWords);
    logger.debug(`Initialized ${filteredWords.length} words for practice`);
  }, [words, settings]);

  const currentWord = activeWords[0] || null;

  const updateProficiency = useCallback(async (word: Word, success: boolean) => {
    try {
      const proficiencyChange = success ? 10 : -5;
      const newProficiency = Math.max(0, Math.min(100, word.proficiency + proficiencyChange));
      
      logger.debug(`Updating proficiency for word ${word.word}: ${word.proficiency} -> ${newProficiency}`);
      await database.updateWordProficiency(word.uuid, newProficiency, success ? 1 : 0);
      
      return {
        ...word,
        proficiency: newProficiency,
        is_known: success ? 1 : 0,
      };
    } catch (error) {
      logger.error('Error updating word proficiency:', error);
      throw error;
    }
  }, [database]);

  const handleSuccess = useCallback(async (success: boolean) => {
    if (!currentWord) return;
    
    try {
      await updateProficiency(currentWord, success);
      logger.info(`Word marked as ${success ? 'known' : 'unknown'}: ${currentWord.word}`);
    } catch (error) {
      logger.error('Error handling success:', error);
    }
  }, [currentWord, updateProficiency]);

  const nextWord = useCallback(() => {
    if (activeWords.length <= 1) {
      // No more words to practice
      setActiveWords([]);
      return;
    }

    // Remove the current word and move to the next one
    const newActiveWords = activeWords.slice(1);
    setActiveWords(newActiveWords);
    
    if (onWordChange && newActiveWords[0]) {
      onWordChange(newActiveWords[0]);
    }
    
    logger.debug(`Moving to next word. ${newActiveWords.length} words remaining`);
  }, [activeWords, onWordChange]);

  return {
    currentWord,
    remainingWords: activeWords.length,
    handleSuccess,
    nextWord,
  };
}

// Helper function to select random words from an array
function selectRandomWords(words: Word[], count: number): Word[] {
  if (count >= words.length) return words;
  
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
} 