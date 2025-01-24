import { useRouter } from "expo-router";

export function useNavigationHelper() {
    const router = useRouter();

    return {
        goHomePush: () => router.push("/home"),
        goHomeReplace: () => router.replace("/home"),
        goBack: () => router.back(),
        goToLanguage: () => router.push("/language"),
        goToSettings: () => router.push("/settings"),
        goToProfile: () => router.push("/profile"),
        goToList: () => router.push("/language/list"),
        goToStudy: () => router.push("/language/study"),
        goToWrite: () => router.push("/language/write"),
        goToMemorize: () => router.push("/language/memorize"),
    };
}
