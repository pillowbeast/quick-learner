import { getDatabase } from "./init";
import { List, ListWithWords, UUID } from "./types";
import { generateUUID } from "../../utils/uuid";
import { logger } from "@/utils/logger";

interface DbList {
    uuid: string;
    language_id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

const mapDbListToList = (result: DbList): List => ({
    uuid: result.uuid,
    languageId: result.language_id,
    name: result.name,
    description: result.description,
    created_at: result.created_at,
    updated_at: result.updated_at,
});

export async function addList(
    languageId: UUID,
    name: string,
    description?: string
): Promise<List> {
    logger.debug(`Adding list: ${name} for language ${languageId}`);
    const db = getDatabase();
    const uuid = generateUUID();
    const now = new Date().toISOString();
    await db.runAsync(
        "INSERT INTO lists (uuid, language_id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [uuid, languageId, name, description, now, now]
    );
    return {
        uuid,
        languageId,
        name,
        description: description || undefined,
        created_at: now,
        updated_at: now,
    };
}

export async function getList(uuid: UUID): Promise<List | null> {
    const db = getDatabase();
    const result = await db.getFirstAsync(
        "SELECT * FROM lists WHERE uuid = ?",
        [uuid]
    ) as DbList | null;
    return result ? mapDbListToList(result) : null;
}

export async function getListsByLanguage(languageId: UUID): Promise<List[]> {
    const db = getDatabase();
    const results = await db.getAllAsync(
        "SELECT * FROM lists WHERE language_id = ? ORDER BY name",
        [languageId]
    ) as DbList[];
    return results.map(mapDbListToList);
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
    ) as DbList | null;
    if (!result) {
        return null;
    }
    const list = mapDbListToList(result);
    const words = await db.getAllAsync(
        "SELECT * FROM words WHERE list_id = ?",
        [uuid]
    );
    return { ...list, words };
} 