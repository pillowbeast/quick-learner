import { LanguageConfig, WordTypeConfig, createBaseConfig, InitialWord } from "@/types/languageConfig";

const germanWordTypes: WordTypeConfig[] = [
    {
        type: 'noun',
        icon: 'book',
        text: 'Nomen',
        description: 'Eine Person, ein Ort, eine Sache oder eine Idee',
        properties: [
            { name: 'article', type: 'select', isRequired: false, options: ['der', 'die', 'das'] },
            { name: 'plural', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'verb',
        icon: 'run',
        text: 'Verb',
        description: 'Eine Handlung oder ein Zustand',
        properties: [
            { 
                name: 'present', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'ich': 'ich',
                    'du': 'du',
                    'er/sie/es': 'er/sie/es',
                    'wir': 'wir',
                    'ihr': 'ihr',
                    'sie/Sie': 'sie/Sie'
                }
            },
            { 
                name: 'präteritum', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'ich': 'ich',
                    'du': 'du',
                    'er/sie/es': 'er/sie/es',
                    'wir': 'wir',
                    'ihr': 'ihr',
                    'sie/Sie': 'sie/Sie'
                }
            },
            { name: 'partizip II', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'adjective',
        icon: 'format-color-fill',
        text: 'Adjektiv',
        description: 'Beschreibt ein Nomen',
        properties: [
            { name: 'comparative', type: 'text', isRequired: false },
            { name: 'superlative', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'adverb',
        icon: 'format-align-justify',
        text: 'Adverb',
        description: 'Beschreibt ein Verb, Adjektiv oder anderes Adverb',
        properties: [
            { name: 'comparative', type: 'text', isRequired: false },
            { name: 'superlative', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'phrase',
        icon: 'format-quote-close',
        text: 'Phrase',
        description: 'Eine Gruppe von Wörtern mit einer bestimmten Bedeutung',
        properties: [
            { name: 'context', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'other',
        icon: 'help-circle',
        text: 'Andere',
        description: 'Jede andere Art von Wort oder Ausdruck',
        properties: [
            { name: 'notes', type: 'text', isRequired: false }
        ]
    }
];

const germanSettings = {
    wordOrder: 'SVO',
    hasGender: true,
    articles: {
        definite: ['der', 'die', 'das'],
        indefinite: ['ein', 'eine', 'ein']
    }
};

const initialGermanWords: InitialWord[] = [
    { word: 'test', translation: 'test', type: 'noun', example: 'Testing Standard List.' },
];

export const germanConfig: LanguageConfig = {
    ...createBaseConfig('de', 'German'),
    wordTypes: germanWordTypes,
    settings: {
        ...createBaseConfig('de', 'German').settings,
        ...germanSettings
    },
    initialWords: initialGermanWords
}; 