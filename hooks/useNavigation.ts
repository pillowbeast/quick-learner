import { useRouter } from "expo-router";
import { useNavigationContext, Language } from "./useNavigationContext";
import { List } from "./database/types";

export function useNavigationHelper() {
    const router = useRouter();
    const { state, setCurrentLanguage, setCurrentList } = useNavigationContext();

    return {
        goOnboarding: () => {
            router.replace("/onboarding");
        },
        goHomePush: () => {
            router.push("/home");
        },
        goHomeReplace: () => {
            router.replace("/home");
        },
        goBack: () => router.back(),
        goToLanguage: (language: Language) => {
            setCurrentLanguage(language);
            router.push(`/language/${language.iso}?name=${language.name}`);
        },
        goToList: (language: Language, list: List) => {
            setCurrentLanguage(language);
            setCurrentList(list);
            router.push(`/language/${language.iso}/${list.name}`);
        },
        goToAddLanguage: () => router.push("/language/add_lang"),
        goToStudy: () => {
            if (!state.currentLanguage?.iso || !state.currentList?.name) {
                throw new Error("Language and list must be set before navigating to study");
            }
            router.push(`/language/${state.currentLanguage.iso}/${state.currentList.name}/practice/study`);
        },
        goToMemorize: (params?: { settings: string }) => {
            if (!state.currentLanguage?.iso || !state.currentList?.name) {
                throw new Error("Language and list must be set before navigating to memorize");
            }
            router.push({
                pathname: `/language/${state.currentLanguage.iso}/${state.currentList.name}/practice/memorize`,
                params
            } as any);
        },
        goToAddWordType: () => {
            if (!state.currentLanguage?.iso || !state.currentList?.name) {
                throw new Error("Language and list must be set before navigating to add word");
            }
            router.push(`/language/${state.currentLanguage.iso}/${state.currentList.name}/word/add_type`);
        },
        goToAddWordDetails: (type: string) => {
            if (!state.currentLanguage?.iso || !state.currentList?.name) {
                throw new Error("Language and list must be set before navigating to word details");
            }
            router.replace({
                pathname: `/language/${state.currentLanguage.iso}/${state.currentList.name}/word/add_details`,
                params: { type }
            } as any);
        },
        goToEditWord: (uuid: string) => {
            if (!state.currentLanguage?.iso || !state.currentList?.name) {
                throw new Error("Language and list must be set before navigating to edit word");
            }
            router.push({
                pathname: `/language/${state.currentLanguage.iso}/${state.currentList.name}/word/${uuid}`,
            } as any);
        },
        goToSettings: () => {
            if (!state.currentLanguage?.iso || !state.currentList?.name) {
                throw new Error("Language and list must be set before navigating to settings");
            }
            router.push(`/language/${state.currentLanguage.iso}/${state.currentList.name}/practice/settings`);
        },
        getCurrentLanguage: () => state.currentLanguage,
        getCurrentList: () => state.currentList,
    };
}
