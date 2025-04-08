import { LanguageConfig, WordTypeConfig, createBaseConfig } from "@/types/languageConfig";

const italianWordTypes: WordTypeConfig[] = [
    {
        type: 'noun',
        icon: 'book',
        text: 'Sostantivo',
        description: 'Una persona, luogo, cosa o idea',
        properties: [
            { name: 'gender', type: 'select', isRequired: false, options: ['m', 'f'] },
            { name: 'plural', type: 'text', isRequired: false },
            { name: 'article', type: 'select', isRequired: false, options: ['il', 'lo', 'la', 'i', 'gli', 'le'] }
        ]
    },
    {
        type: 'verb',
        icon: 'run',
        text: 'Verbo',
        description: 'Un\'azione o stato dell\'essere',
        properties: [
            { 
                name: 'presente', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'io': 'io',
                    'tu': 'tu',
                    'lui/lei': 'lui/lei',
                    'noi': 'noi',
                    'voi': 'voi',
                    'loro': 'loro'
                }
            },
            { 
                name: 'passato prossimo', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'io': 'io',
                    'tu': 'tu',
                    'lui/lei': 'lui/lei',
                    'noi': 'noi',
                    'voi': 'voi',
                    'loro': 'loro'
                }
            },
            { 
                name: 'participio passato', 
                type: 'conjugation', 
                isRequired: false,
                persons: {
                    'io': 'io',
                    'tu': 'tu',
                    'lui/lei': 'lui/lei',
                    'noi': 'noi',
                    'voi': 'voi',
                    'loro': 'loro'
                }
            }
        ]
    },
    {
        type: 'adjective',
        icon: 'format-color-fill',
        text: 'Aggettivo',
        description: 'Descrive un sostantivo',
        properties: [
            { name: 'comparative', type: 'text', isRequired: false },
            { name: 'superlative', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'adverb',
        icon: 'format-align-justify',
        text: 'Avverbio',
        description: 'Descrive un verbo, aggettivo o altro avverbio',
        properties: [
            { name: 'comparative', type: 'text', isRequired: false },
            { name: 'superlative', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'phrase',
        icon: 'format-quote-close',
        text: 'Frase',
        description: 'Un gruppo di parole con un significato specifico',
        properties: [
            { name: 'context', type: 'text', isRequired: false }
        ]
    },
    {
        type: 'other',
        icon: 'help-circle',
        text: 'Altro',
        description: 'Qualsiasi altro tipo di parola o espressione',
        properties: [
            { name: 'notes', type: 'text', isRequired: false }
        ]
    }
];

const italianSettings = {
    wordOrder: 'SVO',
    hasGender: true,
    articles: {
        definite: ['il', 'lo', 'la', 'i', 'gli', 'le'],
        indefinite: ['un', 'uno', 'una', 'un\'']
    }
};

export const initialItalianWords = [
    // Basic Greetings
    { word: "Hello", translation: "Ciao", type: "noun" as const, example: "Ciao, come stai?" },
    { word: "Goodbye", translation: "Arrivederci", type: "noun" as const, example: "Arrivederci, a domani!" },
    { word: "Please", translation: "Per favore", type: "adverb" as const, example: "Per favore, aiutami" },
    { word: "Thank you", translation: "Grazie", type: "noun" as const, example: "Grazie per il tuo aiuto" },
    
    // Common Verbs
    { word: "to be", translation: "essere", type: "verb" as const, example: "Io sono felice" },
    { word: "to have", translation: "avere", type: "verb" as const, example: "Io ho un libro" },
    { word: "to go", translation: "andare", type: "verb" as const, example: "Io vado a scuola" },
    { word: "to do", translation: "fare", type: "verb" as const, example: "Io faccio i compiti" },
    
    // Common Nouns
    { word: "book", translation: "libro", type: "noun" as const, example: "Io leggo un libro" },
    { word: "water", translation: "acqua", type: "noun" as const, example: "Io bevo acqua" },
    { word: "food", translation: "cibo", type: "noun" as const, example: "Mi piace questo cibo" },
    { word: "house", translation: "casa", type: "noun" as const, example: "Questa è la mia casa" },
    
    // Common Adjectives
    { word: "good", translation: "buono", type: "adjective" as const, example: "Questo è buono" },
    { word: "bad", translation: "cattivo", type: "adjective" as const, example: "Questo è cattivo" },
    { word: "big", translation: "grande", type: "adjective" as const, example: "Questo è grande" },
    { word: "small", translation: "piccolo", type: "adjective" as const, example: "Questo è piccolo" },
    
    // Common Adverbs
    { word: "very", translation: "molto", type: "adverb" as const, example: "molto buono" },
    { word: "not", translation: "non", type: "adverb" as const, example: "non male" },
    { word: "always", translation: "sempre", type: "adverb" as const, example: "Io mangio sempre la colazione" },
    { word: "never", translation: "mai", type: "adverb" as const, example: "Io non mangio mai carne" },
    
    // Common Pronouns
    { word: "I", translation: "io", type: "other" as const, example: "Io sono qui" },
    { word: "you", translation: "tu", type: "other" as const, example: "Tu sei gentile" },
    { word: "he", translation: "lui", type: "other" as const, example: "Lui è alto" },
    { word: "she", translation: "lei", type: "other" as const, example: "Lei è intelligente" }
];

export const italianConfig: LanguageConfig = {
    ...createBaseConfig('it', 'Italian'),
    wordTypes: italianWordTypes,
    settings: {
        ...createBaseConfig('it', 'Italian').settings,
        ...italianSettings
    },
    initialWords: initialItalianWords
}; 