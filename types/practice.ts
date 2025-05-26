import { WordType } from './word';

export interface PracticeSettings {
  wordCount: number;
  wordTypes: WordType[];
  useSpacedRepetition: boolean;
  targetProficiency: number;
} 