import { LanguageConfig } from "@/types/languageConfig";
import { englishConfig } from "@/types/languages/english";
import { italianConfig } from "@/types/languages/italian";
import { germanConfig } from "@/types/languages/german";

export const languageConfigs: { [key: string]: LanguageConfig } = {
    en: englishConfig,
    it: italianConfig,
    de: germanConfig
};

export function getLanguageConfig(iso: string): LanguageConfig | undefined {
    return languageConfigs[iso];
}

export function getAvailableLanguages(): string[] {
    return Object.keys(languageConfigs);
} 