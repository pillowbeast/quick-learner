import { usePathname, useRouter } from "expo-router";

export function useNavigationHelper() {
    const router = useRouter();
    const pathname = usePathname();

    return {
        goHomePush: () => router.push("/home"),
        goHomeReplace: () => router.replace("/home"),
        goBack: () => router.back(),
        goToSettings: () => router.push("/settings"),
        goToProfile: () => router.push("/profile"),
        goToLanguage: (iso: string, name: string) => router.push(`/language/${iso}?name=${name}`),
        goToList: (iso: string, name: string) => router.push(`/language/${iso}/${name}`),
        goToStudy: () => router.push(`${pathname}/study`),
        goToMemorize: () => router.push(`${pathname}/memorize`),
        goToAddWord: () => {console.log("Should go to AddWord");
        router.push(`${pathname}/add_word`)},
    };
}
