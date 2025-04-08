import { useState, useCallback, useMemo } from 'react';
import { Word } from './database/types';
import { useDatabase } from './useDatabase';
import { logger } from '@/utils/logger';

interface UseWordSelectionProps {
  words: Word[];
  onWordChange?: (word: Word) => void;
}

interface UseWordSelectionReturn {
  currentWord: Word | null;
  currentIndex: number;
  handleSuccess: (success: boolean) => Promise<void>;
  nextWord: () => void;
}

function calculateWordScore(word: Word): number {
  const now = new Date();
  const lastSeen = word.lastSeen ? new Date(word.lastSeen) : new Date(0);
  const hoursSinceLastSeen = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60);
  
  // Base score starts at 100
  let score = 100;
  
  // Reduce score based on proficiency (lower proficiency = higher priority)
  score -= word.proficiency;
  
  // Reduce score based on time since last seen (longer = higher priority)
  score += hoursSinceLastSeen * 0.1;
  
  // Reduce score based on times answered (more times = lower priority)
  score -= word.timesAnswered * 0.5;
  
  // If word is marked as known, reduce its priority
  if (word.isKnown) {
    score -= 50;
  }
  
  return Math.max(0, score);
}

export function useWordSelection({ words, onWordChange }: UseWordSelectionProps): UseWordSelectionReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const database = useDatabase();

  // Sort words by their score and take up to 5 most relevant words
  const sortedWords = useMemo(() => {
    if (words.length === 0) return [];
    
    const scoredWords = words.map(word => ({
      word,
      score: calculateWordScore(word)
    }));
    
    // Sort by score in descending order (higher score = higher priority)
    scoredWords.sort((a, b) => b.score - a.score);
    
    // Take up to 100 words and shuffle them
    const topWords = scoredWords.slice(0, 5).map(w => w.word);
    return topWords.sort(() => Math.random() - 0.5);
  }, [words]);

  const currentWord = sortedWords[currentIndex] || null;

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
    const nextIndex = currentIndex + 1;
    if (nextIndex >= sortedWords.length) {
      // We've reached the end of the list
      setCurrentIndex(sortedWords.length);
      return;
    }
    setCurrentIndex(nextIndex);
    if (onWordChange && sortedWords[nextIndex]) {
      onWordChange(sortedWords[nextIndex]);
    }
  }, [currentIndex, sortedWords, onWordChange]);

  return {
    currentWord,
    currentIndex,
    handleSuccess,
    nextWord,
  };
} 