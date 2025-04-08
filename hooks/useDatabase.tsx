import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { setupDatabase, resetDatabase } from "@/hooks/database/init";
import * as languageDb from "@/hooks/database/language";
import * as listDb from "@/hooks/database/list";
import * as wordDb from "@/hooks/database/word";

type DatabaseContextType = {
    isLoading: boolean;
    isInitialized: boolean;
} & typeof languageDb & typeof listDb & typeof wordDb & {
    reset: () => Promise<void>;
};

const DatabaseContext = createContext<DatabaseContextType | null>(null);

interface DatabaseProviderProps {
    children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initialize() {
            try {
                await setupDatabase();
                setIsInitialized(true);
            } catch (error) {
                console.error("Failed to initialize database:", error);
            } finally {
                setIsLoading(false);
            }
        }
        initialize();
    }, []);

    const value: DatabaseContextType = {
        isLoading,
        isInitialized,
        ...languageDb,
        ...listDb,
        ...wordDb,
        reset: resetDatabase,
    };

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    );
}

export function useDatabase() {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error("useDatabase must be used within a DatabaseProvider");
    }
    return context;
}