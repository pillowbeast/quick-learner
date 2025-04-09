import React from "react";
import { View, StyleSheet } from "react-native";
import CountryFlag from "react-native-country-flag";

// Map language codes to country codes
const languageToCountryCode: { [key: string]: string } = {
    'en': 'gb', // English -> United Kingdom
    'es': 'es', // Spanish -> Spain
    'fr': 'fr', // French -> France
    'de': 'de', // German -> Germany
    'it': 'it', // Italian -> Italy
    'pt': 'pt', // Portuguese -> Portugal
};

export default function Flag({ iso }: { iso: string }) {
    const countryCode = languageToCountryCode[iso.toLowerCase()] || iso.toLowerCase();
    return (
        <View style={styles.container}>
            <CountryFlag isoCode={countryCode} size={30} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
    },
});
