export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'other';

export type PropertyType = 'text' | 'select' | 'conjugation';

export interface WordProperty {
    name: string;
    value: string | Record<string, string>;
    type: PropertyType;
}

export type WordProperties = {
  [key: string]: WordProperty;
};

export interface Word {
    uuid: string;
    listId: number;
    word: string;
    translation: string;
    type: WordType;
    example?: string;
    properties: WordProperties;
    // Study-related properties
    proficiency: number; // 0-100 scale
    lastSeen?: Date; // Last time the word was studied
    isKnown: number;
    timesAnswered: number; // Number of times the word has been answered
}
