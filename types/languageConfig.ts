import { PropertyType, WordType } from "./word";

export interface LanguageSettings {
    wordOrder: string;
    hasGender: boolean;
    articles?: {
        definite?: string[];
        indefinite?: string[];
    };
    [key: string]: any; // Allow additional settings
}

export interface WordTypeConfig {
    type: WordType;
    icon: string;
    text?: string;
    description?: string;
    properties: {
        name: string;
        type: PropertyType;
        isRequired?: boolean;
        options?: string[];
        persons?: Record<string, string>;
    }[];
}

export interface InitialWord {
    word: string;
    translation: string;
    type: WordType;
    example?: string;
}

export interface LanguageConfig {
    iso: string;
    name: string;
    wordTypes: WordTypeConfig[];
    settings: LanguageSettings;
    initialWords?: InitialWord[];
}

// Base language configuration
export const baseWordTypes: WordTypeConfig[] = [
    {
        type: 'noun',
        icon: 'book',
        text: 'Noun',
        description: 'A person, place, thing, or idea',
        properties: [
            { name: 'gender', type: 'select', isRequired: false, options: ['der', 'die', 'das'] },
            { name: 'plural', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'verb',
        icon: 'run',
        text: 'Verb',
        description: 'An action or state of being',
        properties: [
            { name: 'infinitive', type: 'text', isRequired: false },
            { 
                name: 'presentSimple', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'I': 'I',
                    'you': 'you',
                    'he/she/it': 'he/she/it',
                    'we': 'we',
                    'you (plural)': 'you (plural)',
                    'they': 'they'
                }
            },
            { 
                name: 'pastSimple', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'I': 'I',
                    'you': 'you',
                    'he/she/it': 'he/she/it',
                    'we': 'we',
                    'you (plural)': 'you (plural)',
                    'they': 'they'
                }
            },
            { name: 'pastParticiple', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'adjective',
        icon: 'format-color-fill',
        text: 'Adjective',
        description: 'Describes a noun',
        properties: [
            { name: 'comparative', type: 'text', isRequired: false },
            { name: 'superlative', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'adverb',
        icon: 'format-align-justify',
        text: 'Adverb',
        description: 'Describes a verb, adjective, or other adverb',
        properties: [
            { name: 'comparative', type: 'text', isRequired: false },
            { name: 'superlative', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'phrase',
        icon: 'format-quote-close',
        text: 'Phrase',
        description: 'A group of words with a specific meaning',
        properties: [
            { name: 'context', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'other',
        icon: 'help-circle',
        text: 'Other',
        description: 'Any other type of word or expression',
        properties: [
            { name: 'notes', type: 'text', isRequired: false }
        ]
    }
];

export const baseSettings: LanguageSettings = {
    wordOrder: 'SVO',
    hasGender: false
};

export function createBaseConfig(iso: string, name: string): LanguageConfig {
    return {
        iso,
        name,
        wordTypes: baseWordTypes,
        settings: baseSettings
    };
} 