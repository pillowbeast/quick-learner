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
    language_iso: string;
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
    list_id: UUID;
    word: string;
    translation: string;
    type: string;
    example?: string;
    proficiency: number;
    last_seen?: string;
    times_answered: number;
    isKnown: boolean;
    created_at: string;
    updated_at: string;
}

export interface WordProperty {
    word_id: UUID;
    name: string;
    value: string;
    type: string;
    created_at: string;
}

export interface ExportedList {
    name: string;
    description?: string;
    language_iso: string;
    words: {
        word: string;
        translation: string;
        type: string;
        example?: string;
    }[];
}
