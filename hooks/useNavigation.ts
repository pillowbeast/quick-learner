import { useRouter } from "expo-router";

export function useNavigationHelper() {
    const router = useRouter();

    return {
        goHomePush: () => router.push("/home"),
        goHomeReplace: () => router.replace("/home"),
        goBack: () => router.back(),
        goToLanguage: (iso: string, name: string) => router.push(`/language/${iso}?name=${name}`),
        goToSettings: () => router.push("/settings"),
        goToProfile: () => router.push("/profile"),
        goToList: () => router.push("/language/list"),
        goToStudy: () => router.push("/language/study"),
        goToMemorize: () => router.push("/language/memorize"),
        goToAddWord: () => router.push("/language/add_word"),
    };
}
