import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import localforage from "localforage";
import { logger } from "@/utils/logger";

let db: any = null;

// Configure IndexedDB for Web
if (Platform.OS === "web") {
    localforage.config({
        name: "quicklearner",
        storeName: "languages",
    });
}

export async function setupDatabase() {
    logger.info("Setting up database...");
    if (Platform.OS === "web") {
        logger.info("Web platform detected, using IndexedDB");
        return;
    } else {
        try {
            db = await SQLite.openDatabaseAsync("language_learning.db");
            logger.info("SQLite database opened successfully");

            // Check if we need to migrate from language_id to language_iso
            const tableInfo = await db.getAllAsync("PRAGMA table_info(lists)");
            const hasLanguageIso = tableInfo.some((col: any) => col.name === "language_iso");
            const hasLanguageId = tableInfo.some((col: any) => col.name === "language_id");

            if (hasLanguageId && !hasLanguageIso) {
                logger.info("Migrating lists table from language_id to language_iso");
                await db.execAsync(`
                    ALTER TABLE lists RENAME COLUMN language_id TO language_iso;
                `);
            }

            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS languages (
                    uuid TEXT PRIMARY KEY UNIQUE,
                    iso TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS lists (
                    uuid TEXT PRIMARY KEY UNIQUE,
                    language_iso TEXT NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (language_iso) REFERENCES languages(iso) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS words (
                    uuid TEXT PRIMARY KEY UNIQUE,
                    list_id TEXT NOT NULL,
                    word TEXT NOT NULL,
                    translation TEXT NOT NULL,
                    type TEXT NOT NULL,
                    example TEXT,
                    proficiency INTEGER DEFAULT 25,
                    is_known INTEGER DEFAULT 0,
                    last_seen DATETIME,
                    times_answered INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (list_id) REFERENCES lists(uuid) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS word_properties (
                    word_id TEXT NOT NULL,
                    name TEXT NOT NULL,
                    value TEXT,
                    type TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (word_id, name),
                    FOREIGN KEY (word_id) REFERENCES words(uuid) ON DELETE CASCADE
                );

                CREATE INDEX IF NOT EXISTS idx_languages_iso ON languages(iso);
                CREATE INDEX IF NOT EXISTS idx_lists_language_iso ON lists(language_iso);
                CREATE INDEX IF NOT EXISTS idx_words_list_id ON words(list_id);
                CREATE INDEX IF NOT EXISTS idx_word_properties_word_id ON word_properties(word_id);
            `);
            logger.info("Database tables created successfully");
        } catch (error) {
            logger.error("Error setting up database:", error);
            throw error;
        }
    }
}

export function getDatabase(): any {
    if (!db) {
        logger.error("Database not initialized. Call setupDatabase() first.");
        throw new Error("Database not initialized. Call setupDatabase() first.");
    }
    return db;
}

export async function resetDatabase() {
    logger.info("Resetting database...");
    if (Platform.OS === "web") {
        try {
            await localforage.clear();
            logger.info("Web database cleared successfully");
        } catch (error) {
            logger.error("Error clearing web database:", error);
            throw error;
        }
    } else {
        try {
            if (db) {
                await db.closeAsync();
            }
            db = await SQLite.openDatabaseAsync("language_learning.db");
            await db.execAsync(`
                DROP TABLE IF EXISTS language_configs;
                DROP TABLE IF EXISTS word_properties;
                DROP TABLE IF EXISTS words;
                DROP TABLE IF EXISTS lists;
                DROP TABLE IF EXISTS languages;
            `);
            logger.info("SQLite database tables dropped successfully");
        } catch (error) {
            logger.error("Error resetting SQLite database:", error);
            throw error;
        }
    }
    await setupDatabase();
} 