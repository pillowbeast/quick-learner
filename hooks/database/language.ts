import { Platform } from "react-native";
import localforage from "localforage";

import { getDatabase } from "@/hooks/database/init";
import { Language } from "@/hooks/database/types";
import { generateUUID } from "@/utils/uuid";
import { logger } from "@/utils/logger";

export async function addLanguage(iso: string, name: string): Promise<Language> {
    logger.debug(`Adding language: ${iso} (${name})`);
    const uuid = generateUUID();
    const now = new Date().toISOString();
    const language: Language = {
        uuid,
        iso,
        name,
        created_at: now,
        updated_at: now
    };

    if (Platform.OS === "web") {
        try {
            await localforage.setItem(uuid, language);
            logger.info(`Language added successfully: ${iso}`);
            return language;
        } catch (error) {
            logger.error(`Error adding language ${iso}:`, error);
            throw error;
        }
    } else {
        const db = await getDatabase();
        try {
            await db.runAsync(
                "INSERT INTO languages (uuid, iso, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                [uuid, iso, name, now, now]
            );

            logger.info(`Language added successfully: ${iso}`);
            return language;
        } catch (error) {
            logger.error(`Error adding language ${iso}:`, error);
            throw error;
        }
    }
}

export async function getLanguage(uuid: string): Promise<Language | null> {
    logger.debug(`Getting language: ${uuid}`);
    if (Platform.OS === "web") {
        try {
            const language = await localforage.getItem<Language>(uuid);
            if (language) {
                logger.debug(`Found language: ${language.iso}`);
            } else {
                logger.debug(`Language not found: ${uuid}`);
            }
            return language;
        } catch (error) {
            logger.error(`Error getting language ${uuid}:`, error);
            throw error;
        }
    } else {
        const db = await getDatabase();
        try {
            const result = await db.getFirstAsync(
                "SELECT * FROM languages WHERE uuid = ?",
                [uuid]
            );
            if (result) {
                logger.debug(`Found language: ${result.iso}`);
            } else {
                logger.debug(`Language not found: ${uuid}`);
            }
            return result;
        } catch (error) {
            logger.error(`Error getting language ${uuid}:`, error);
            throw error;
        }
    }
}

export async function getAllLanguages(): Promise<Language[]> {
    logger.debug("Getting all languages");
    if (Platform.OS === "web") {
        try {
            const languages: Language[] = [];
            await localforage.iterate((value: Language) => {
                languages.push(value);
            });
            logger.debug(`Found ${languages.length} languages`);
            return languages;
        } catch (error) {
            logger.error("Error getting all languages:", error);
            throw error;
        }
    } else {
        const db = await getDatabase();
        try {
            const result = await db.getAllAsync("SELECT * FROM languages");
            logger.debug(`Found ${result.length} languages`);
            return result;
        } catch (error) {
            logger.error("Error getting all languages:", error);
            throw error;
        }
    }
}

export async function updateLanguage(uuid: string, name: string): Promise<void> {
    logger.debug(`Updating language: ${uuid} (new name: ${name})`);
    const now = new Date().toISOString();
    if (Platform.OS === "web") {
        try {
            const language = await getLanguage(uuid);
            if (language) {
                language.name = name;
                language.updated_at = now;
                await localforage.setItem(uuid, language);
                logger.info(`Language updated successfully: ${uuid}`);
            } else {
                logger.warn(`Language not found for update: ${uuid}`);
                throw new Error(`Language not found: ${uuid}`);
            }
        } catch (error) {
            logger.error(`Error updating language ${uuid}:`, error);
            throw error;
        }
    } else {
        const db = await getDatabase();
        try {
            await db.runAsync(
                "UPDATE languages SET name = ?, updated_at = ? WHERE uuid = ?",
                [name, now, uuid]
            );
            logger.info(`Language updated successfully: ${uuid}`);
        } catch (error) {
            logger.error(`Error updating language ${uuid}:`, error);
            throw error;
        }
    }
}

export async function deleteLanguage(uuid: string): Promise<void> {
    logger.debug(`Deleting language: ${uuid}`);
    if (Platform.OS === "web") {
        try {
            await localforage.removeItem(uuid);
            logger.info(`Language deleted successfully: ${uuid}`);
        } catch (error) {
            logger.error(`Error deleting language ${uuid}:`, error);
            throw error;
        }
    } else {
        const db = await getDatabase();
        try {
            await db.runAsync("DELETE FROM languages WHERE uuid = ?", [uuid]);
            logger.info(`Language deleted successfully: ${uuid}`);
        } catch (error) {
            logger.error(`Error deleting language ${uuid}:`, error);
            throw error;
        }
    }
}
