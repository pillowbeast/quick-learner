import { getDatabase } from "./init";
import { Word, UUID, WordProperty } from "./types";
import { WordType } from "@/types/word";
import { generateUUID } from "@/utils/uuid";
import { logger } from "@/utils/logger";
import * as languageDb from "./language";

interface DbWord {
    uuid: string;
    list_id: string;
    word: string;
    translation: string;
    type: string;
    example?: string;
    proficiency: number;
    last_seen?: string;
    times_answered: number;
    is_known: number;
    created_at: string;
    updated_at: string;
}

function mapRowToWord(row: DbWord): Word {
    return {
        uuid: row.uuid,
        list_id: row.list_id,
        word: row.word,
        translation: row.translation,
        type: row.type as WordType,
        example: row.example,
        proficiency: row.proficiency,
        last_seen: row.last_seen,
        times_answered: row.times_answered,
        isKnown: row.is_known === 1,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

// Words
export async function getWord(uuid: UUID): Promise<Word | null> {
    logger.debug(`Getting word: ${uuid}`);
    const db = await getDatabase();
    try {
        const result = await db.getFirstAsync(
            "SELECT * FROM words WHERE uuid = ?",
            [uuid]
        ) as DbWord | null;
        
        if (result) {
            logger.debug(`Found word: ${result.word}`);
            return mapRowToWord(result);
        } else {
            logger.debug(`Word not found: ${uuid}`);
            return null;
        }
    } catch (error) {
        logger.error(`Error getting word ${uuid}:`, error);
        throw error;
    }
}

export async function addWord(
    list_id: UUID,
    word: string,
    translation: string,
    type: string,
    example?: string
): Promise<Word> {
    const db = await getDatabase();
    const uuid = generateUUID();
    const now = new Date().toISOString();

    const wordObj: Word = {
        uuid,
        list_id,
        word,
        translation,
        type,
        example,
        proficiency: 25,
        isKnown: false,
        times_answered: 0,
        created_at: now,
        updated_at: now
    };

    await db.runAsync(
        `INSERT INTO words (uuid, list_id, word, translation, type, example, proficiency, is_known, times_answered, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuid, list_id, word, translation, type, example || null, 25, 0, 0, now, now]
    );

    return wordObj;
}

export async function getWordsByList(list_id: UUID): Promise<Word[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync(
        "SELECT * FROM words WHERE list_id = ?",
        [list_id]
    ) as DbWord[];
    return results.map(mapRowToWord);
}

export async function updateWord(
    uuid: UUID,
    word: string,
    translation: string,
    type: string,
    example?: string
): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
        "UPDATE words SET word = ?, translation = ?, type = ?, example = ?, updated_at = ? WHERE uuid = ?",
        [word, translation, type, example || null, now, uuid]
    );
}

export async function deleteWord(uuid: UUID): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM words WHERE uuid = ?", [uuid]);
}

export async function updateWordProficiency(
    uuid: UUID,
    proficiency: number,
    isKnown: boolean
): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
        "UPDATE words SET proficiency = ?, is_known = ?, last_seen = ?, times_answered = times_answered + 1, updated_at = ? WHERE uuid = ?",
        [proficiency, isKnown ? 1 : 0, now, now, uuid]
    );
}

// Word properties
export async function getWordProperties(word_id: UUID): Promise<WordProperty[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync(
        "SELECT * FROM word_properties WHERE word_id = ?",
        [word_id]
    ) as WordProperty[];
    return results;
}
export async function addWordProperty(
    word_id: UUID,
    name: string,
    value: string,
    type: string
): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
        "INSERT INTO word_properties (word_id, name, value, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [word_id, name, value, type, now, now]
    );
}

export async function updateWordProperty(word_id: UUID, name: string, value: string): Promise<void> {
    logger.debug(`Updating word property: ${word_id} ${name} ${value}`);
    const db = await getDatabase();
    const now = new Date().toISOString();
    try {
        await db.runAsync(
        "UPDATE word_properties SET value = ?, updated_at = ? WHERE word_id = ? AND name = ?",
        [value, now, word_id, name]
    );
    } catch (error) {
        logger.error(`Error updating word property ${word_id} ${name}:`, error);
        throw error;
    }
}

export async function deleteWordProperty(word_id: UUID, name: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        "DELETE FROM word_properties WHERE word_id = ? AND name = ?",
        [word_id, name]
    );
}