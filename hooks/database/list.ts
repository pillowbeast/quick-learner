import { getDatabase } from "./init";
import { List, ListWithWords, UUID } from "./types";
import { generateUUID } from "../../utils/uuid";
import { logger } from "@/utils/logger";
import { WordProperties, WordType } from "@/types/word";
import { getWordsByList, addWord } from "./word";

export async function addList(language_iso: string, name: string, description?: string): Promise<List> {
    const db = await getDatabase();
    const uuid = generateUUID();
    const now = new Date().toISOString();

    const listObj: List = {
        uuid,
        language_iso,
        name,
        description,
        created_at: now,
        updated_at: now
    };

    await db.runAsync(
        `INSERT INTO lists (uuid, language_iso, name, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuid, language_iso, name, description, now, now]
    );

    return listObj;
}

export async function getList(uuid: UUID): Promise<List | null> {
    const db = getDatabase();
    const result = await db.getFirstAsync(
        "SELECT * FROM lists WHERE uuid = ?",
        [uuid]
    ) as List | null;
    return result;
}

export async function getListsByLanguage(language_iso: string): Promise<List[]> {
    const db = getDatabase();
    const results = await db.getAllAsync(
        "SELECT * FROM lists WHERE language_iso = ? ORDER BY name",
        [language_iso]
    ) as List[];
    return results;
}

export async function updateList(
    uuid: UUID,
    name: string,
    description?: string
): Promise<void> {
    const db = getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
        "UPDATE lists SET name = ?, description = ?, updated_at = ? WHERE uuid = ?",
        [name, description, now, uuid]
    );
}

export async function deleteList(uuid: UUID): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
        "DELETE FROM lists WHERE uuid = ?",
        [uuid]
    );
}

export async function getListWithWords(uuid: UUID): Promise<ListWithWords | null> {
    const db = getDatabase();
    const result = await db.getFirstAsync(
        "SELECT * FROM lists WHERE uuid = ?",
        [uuid]
    ) as List | null;
    if (!result) {
        return null;
    }
    const list = result;
    const words = await db.getAllAsync(
        "SELECT * FROM words WHERE list_id = ?",
        [uuid]
    );
    return { ...list, words };
}

export interface ExportedList {
    name: string;
    description?: string;
    language_iso: string;
    words: {
        word: string;
        translation: string;
        type: WordType;
        example?: string;
        properties: WordProperties;
    }[];
}

export async function exportList(listId: string): Promise<ExportedList> {
    const list = await getList(listId);
    if (!list) {
        throw new Error('List not found');
    }

    const words = await getWordsByList(listId);

    return {
        name: list.name,
        description: list.description,
        language_iso: list.language_iso,
        words: words.map((word: any) => ({
            word: word.word,
            translation: word.translation,
            type: word.type,
            example: word.example,
            properties: word.properties
        }))
    };
}

export async function importList(exportedList: ExportedList): Promise<string> {
    const db = await getDatabase();
    const listId = generateUUID();
    const now = new Date().toISOString();

    // Create the list
    await db.runAsync(
        `INSERT INTO lists (uuid, name, description, language_iso, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [listId, exportedList.name, exportedList.description || '', exportedList.language_iso, now, now]
    );

    // Add all words
    for (const word of exportedList.words) {
        await addWord(
            listId,
            word.word,
            word.translation,
            word.type,
            word.example
        );
    }

    return listId;
} 