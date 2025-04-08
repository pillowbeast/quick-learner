import { getDatabase } from "./init";
import { Word, UUID, WordProperty } from "./types";
import { WordType, PropertyType } from "@/types/word";
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

const mapRowToWord = (row: DbWord): Word => ({
    uuid: row.uuid,
    listId: row.list_id,
    word: row.word,
    translation: row.translation,
    type: row.type as WordType,
    example: row.example,
    properties: {},
    proficiency: row.proficiency,
    lastSeen: row.last_seen ? new Date(row.last_seen) : undefined,
    timesAnswered: row.times_answered,
    isKnown: row.is_known,
    created_at: row.created_at,
    updated_at: row.updated_at || row.created_at,
});

export async function addWord(
    listId: UUID,
    word: string,
    translation: string,
    type: WordType,
    example?: string
): Promise<Word> {
    const db = getDatabase();
    const uuid = generateUUID();
    logger.debug(`Adding new word: ${word} to list ${listId}`);
    const now = new Date().toISOString();

    await db.runAsync(
        "INSERT INTO words (uuid, list_id, word, translation, type, example, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [uuid, listId, word, translation, type, example, now, now]
    );

    return {
        uuid,
        listId,
        word,
        translation,
        type,
        example: example || undefined,
        properties: {},
        proficiency: 0,
        lastSeen: undefined,
        timesAnswered: 0,
        isKnown: 0,
        created_at: now,
        updated_at: now,
    };
}

export async function getWord(uuid: UUID): Promise<Word | null> {
    logger.debug(`Getting word: ${uuid}`);
    const db = getDatabase();
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

export async function getWordsByList(listId: UUID): Promise<Word[]> {
    const db = getDatabase();
    const results = await db.getAllAsync(
        "SELECT * FROM words WHERE list_id = ?",
        [listId]
    ) as DbWord[];
    return results.map(mapRowToWord);
}

export async function updateWord(
    uuid: UUID,
    word: string,
    translation: string,
    type: WordType,
    example?: string
): Promise<void> {
    const db = getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
        "UPDATE words SET word = ?, translation = ?, type = ?, example = ?, updated_at = ? WHERE uuid = ?",
        [word, translation, type, example, now, uuid]
    );
}

export async function deleteWord(uuid: UUID): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
        "DELETE FROM words WHERE uuid = ?",
        [uuid]
    );
}

export async function getWordProperties(uuid: UUID): Promise<{ name: string; value: string, type: PropertyType }[]> {
    const db = getDatabase();
    const results = await db.getAllAsync(
        "SELECT name, value, type FROM word_properties WHERE word_id = ?",
        [uuid]
    );
    return results.map((result: { name: string; value: string; type: PropertyType }) => ({
        name: result.name,
        value: result.value,
        type: result.type
    }));
}

export async function addWordProperty(
    uuid: UUID,
    name: string,
    value: string,
    type: PropertyType
): Promise<WordProperty> {
    const db = getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
        "INSERT INTO word_properties (word_id, name, value, type, created_at) VALUES (?, ?, ?, ?, ?)",
        [uuid, name, value, type, now]
    );
    console.log(`Added word property: ${name} to word: ${uuid}`);
    return {
        wordId: uuid,
        name,
        value,
        type,
        created_at: now
    };
}

export async function updateWordProperty(
    uuid: UUID,
    name: string,
    value: string
): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
        "UPDATE word_properties SET value = ? WHERE word_id = ? AND name = ?",
        [value, uuid, name]
    );
}

export async function deleteWordProperty(
    uuid: UUID,
    name: string
): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
        "DELETE FROM word_properties WHERE word_id = ? AND name = ?",
        [uuid, name]
    );
} 

export async function updateWordProficiency(
    uuid: UUID,
    proficiency: number,
    is_known: number,
): Promise<void> {
    const db = getDatabase();
    logger.debug(`Updating proficiency for word: ${uuid} to ${proficiency}`);
    await db.runAsync(
        "UPDATE words SET proficiency = ?, is_known = ?, last_seen = CURRENT_TIMESTAMP, times_answered = times_answered + 1 WHERE uuid = ?",
        [proficiency, is_known, uuid]
    );
}