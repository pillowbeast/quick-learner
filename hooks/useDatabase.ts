import { Platform } from "react-native";
import localforage from "localforage";

let db: any = null;

// 🔹 Configure IndexedDB for Web
if (Platform.OS === "web") {
    localforage.config({
        name: "quicklearner",
        storeName: "languages",
    });
}

// 🔹 Function to Initialize the Database (Web: IndexedDB, Mobile: SQLite)
export async function setupDatabase() {
    if (Platform.OS === "web") {
        console.log("Using IndexedDB for Web.");
        return;
    }

    // 🛠️ Dynamically Import expo-sqlite Only for Mobile
    const SQLite = await import("expo-sqlite");
    if (!db) {
        db = await SQLite.openDatabaseAsync("language_learning.db");
    }

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        iso TEXT UNIQUE NOT NULL
        );
        CREATE TABLE IF NOT EXISTS lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY(language_id) REFERENCES languages(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language_id INTEGER NOT NULL,
        list_id INTEGER,
        term TEXT NOT NULL,
        translation TEXT NOT NULL,
        FOREIGN KEY(language_id) REFERENCES languages(id) ON DELETE CASCADE
        FOREIGN KEY(list_id) REFERENCES lists(id) ON DELETE CASCADE
        );
    `);
}

// 🔹 Function to Get Database Instance (Mobile Only)
export function getDatabase(): any {
    if (!db) {
        throw new Error("Database not initialized. Call setupDatabase() first.");
    }
    return db;
}

// 🔹 Function to Add Language (Web: IndexedDB, Mobile: SQLite)
export async function addLanguage(name: string, iso: string) {
    if (Platform.OS === "web") {
        const existing: { id: number; name: string; iso: string }[] = (await localforage.getItem("languages")) || [];
        const isDuplicate = existing.some((lang) => lang.name === name || lang.iso === iso);

        if (isDuplicate) {
            console.warn(`Language ${name} or ISO ${iso} already exists.`);
            return null
        }
        const lang_id = Date.now();
        const newLanguages = [...existing, { id: lang_id, name, iso }];
        await localforage.setItem("languages", newLanguages);
        addDefaultList(name, iso, lang_id);
        return newLanguages.length;
    }

    const db = getDatabase();
    try {
        const result = await db.runAsync("INSERT INTO languages (name, iso) VALUES (?, ?)", [name, iso]);
        addDefaultList(name, iso, result.lastInsertRowId);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding language:", error);
        return null;
    }
}

export async function addDefaultList(langName: string, iso: string, languageId: number) {
    addList("My Vocabulary", languageId, "en");
    console.log(`Added default list for ${langName} (${iso})`);
}

// 🔹 Function to Get Languages (Web: IndexedDB, Mobile: SQLite)
export async function getLanguages() {
    if (Platform.OS === "web") {
        return (await localforage.getItem("languages")) || [];
    }

    const db = getDatabase();
    try {
        return await db.getAllAsync("SELECT id, name, iso FROM languages");
    } catch (error) {
        console.error("Error fetching languages:", error);
        return [];
    }
}

// 🔹 Function to Add List (Web: IndexedDB, Mobile: SQLite
export async function addList(name: string, languageId: number, iso: string): Promise<{ language_id: number; iso: string; id: number; name: string } | null> {
    if (Platform.OS === "web") {
        const existing: { id: number; name: string; language_id: number; iso: string }[] = (await localforage.getItem(`lists_${languageId}`)) || [];
        const isDuplicate = existing.some((list) => list.name === name);

        if (isDuplicate) {
            console.warn(`List ${name} already exists for language!`);
            return null;
        }
        const newList = [...existing, { id: Date.now(), name, language_id: languageId, iso: iso}];
        await localforage.setItem(`lists_${languageId}`, newList);
        return newList[newList.length - 1];
    }

    const db = getDatabase();
    try {
        const result = await db.runAsync("INSERT INTO lists (name, language_id) VALUES (?, ?)", [name, languageId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding list:", error);
        return null;
    }
}

// 🔹 Function to Get Lists (Web: IndexedDB, Mobile: SQLite
export async function getLists(languageId: number): Promise<{ iso: string; id: number; name: string }[]> {
    if (Platform.OS === "web") {
        return (await localforage.getItem(`lists_${languageId}`)) || [];
    }

    const db = getDatabase();
    try {
        return await db.getAllAsync("SELECT language_id, id, name FROM lists WHERE language_id = ?", [languageId]);
    } catch (error) {
        console.error("Error fetching lists:", error);
        return [];
    }
}

type WordEntry = {
    languageId: number;
    listId?: number;
    id: number
    type: string;
    term: string;
    translation: string;
};

// 🔹 Function to Add Words (Web: IndexedDB, Mobile: SQLite)
export async function addWord({languageId, listId, type, term, translation}: Omit<WordEntry, "id">): Promise<number | null> {
    // if anything is missing, return null
    if (!languageId || !type || !term || !translation) {
        return null;
    }
    if (!listId) {
        listId = 0;
    }

    if (Platform.OS === "web") {
        const existing: WordEntry[] = (await localforage.getItem(`words_${languageId}`)) || [];
        const isDuplicate = existing.some(entry => entry.term === term);
        if (isDuplicate) {
            console.warn(`Word "${term}" already exists for language!`);
            return null;
        }
        // Generate the New ID
        const newWord: WordEntry = { languageId, listId, id: Date.now(), type, term, translation };
        const updatedWords = [...existing, newWord];
        await localforage.setItem(`words_${languageId}`, updatedWords);
        return updatedWords.length;
    }

    const db = getDatabase();
    try {
        const result = await db.runAsync(
            "INSERT INTO words (languageId, listId, type, term, translation) VALUES (?, ?, ?, ?, ?)",
            [languageId, listId, type, term, translation]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error adding word:", error);
        return null;
    }
}

// 🔹 Function to Get Words (Web: IndexedDB, Mobile: SQLite)
export async function getWords(languageId: number) {
    if (Platform.OS === "web") {
        return (await localforage.getItem(`words_${languageId}`)) || [];
    }

    const db = getDatabase();
    try {
        return await db.getAllAsync("SELECT id, word, translation FROM words WHERE language_id = ?", [languageId]);
    } catch (error) {
        console.error("Error fetching words:", error);
        return [];
    }
}
