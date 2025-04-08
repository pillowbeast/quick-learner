import { WordType, PropertyType } from "@/types/word";

export type UUID = string;

export interface Language {
    uuid: UUID;
    iso: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface List {
    uuid: UUID;
    languageId: UUID;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface ListWithWords extends List {
    words: Word[];
}

export interface Word {
    uuid: UUID;
    listId: UUID;
    word: string;
    translation: string;
    example?: string;
    type: WordType;
    properties: Record<string, any>;
    proficiency: number;
    lastSeen?: Date;
    timesAnswered: number;
    isKnown: number;
    created_at: string;
    updated_at: string;
}

export interface WordProperty {
    wordId: UUID;
    name: string;
    value: string;
    type: PropertyType;
    created_at: string;
}
