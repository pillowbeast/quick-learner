import { LanguageConfig, WordTypeConfig, createBaseConfig, InitialWord } from "@/types/languageConfig";

const englishWordTypes: WordTypeConfig[] = [
    {
        type: 'noun',
        icon: 'book',
        properties: [
            { name: 'article', type: 'select', isRequired: false, options: ['the', 'a', 'an'] },
            { name: 'plural', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'verb',
        icon: 'run',
        properties: [
            { 
                name: 'presentSimple', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'I': 'I am',
                    'you': 'you are',
                    'he/she/it': 'he/she/it is',
                    'we': 'we are',
                    'you (plural)': 'you are',
                    'they': 'they are'
                }
            },
            { 
                name: 'pastSimple', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'I': 'I was',
                    'you': 'you were',
                    'he/she/it': 'he/she/it was',
                    'we': 'we were',
                    'you (plural)': 'you were',
                    'they': 'they were'
                }
            },
            { 
                name: 'pastParticiple', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'I': 'I have been',
                    'you': 'you have been',
                    'he/she/it': 'he/she/it has been',
                    'we': 'we have been',
                    'you (plural)': 'you have been',
                    'they': 'they have been'
                }
            }
        ]
    },
    {
        type: 'adjective',
        icon: 'format-color-fill',
        properties: [
            { name: 'comparative', type: 'text', isRequired: false },
            { name: 'superlative', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'adverb',
        icon: 'format-align-justify',
        properties: [
            { name: 'comparative', type: 'text', isRequired: false },
            { name: 'superlative', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'phrase',
        icon: 'format-quote-close',
        properties: [
            { name: 'context', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'other',
        icon: 'help-circle',
        properties: [
            { name: 'notes', type: 'text', isRequired: false }
        ]
    }
];

const englishSettings = {
    wordOrder: 'SVO',
    hasGender: false,
    articles: {
        definite: ['the'],
        indefinite: ['a', 'an']
    }
};

const initialEnglishWords: InitialWord[] = [
    { word: 'test', translation: 'test', type: 'noun', example: 'Testing Standard List.' },
];

export const englishConfig: LanguageConfig = {
    ...createBaseConfig('en', 'English'),
    wordTypes: englishWordTypes,
    settings: {
        ...createBaseConfig('en', 'English').settings,
        ...englishSettings
    },
    initialWords: initialEnglishWords
}; 