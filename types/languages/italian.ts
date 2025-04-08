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
            { name: 'participio passato', type: 'text', isRequired: false }
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

export const italianConfig: LanguageConfig = {
    ...createBaseConfig('it', 'Italian'),
    wordTypes: italianWordTypes,
    settings: {
        ...createBaseConfig('it', 'Italian').settings,
        ...italianSettings
    }
}; 