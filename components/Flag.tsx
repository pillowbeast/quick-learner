import React from "react";
import { View, StyleSheet } from "react-native";
import CountryFlag from "react-native-country-flag";
import { Surface } from 'react-native-paper';

import { useAppTheme } from "@/styles/ThemeContext";
import { spacing } from "@/styles/tokens";

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
    const {colors, theme } = useAppTheme();
    const countryCode = languageToCountryCode[iso.toLowerCase()] || iso.toLowerCase();
    return (
        <View>
            <Surface 
                style={[styles.surface, { shadowColor: colors.text }]}
                elevation={4}
            >
                <CountryFlag 
                    isoCode={countryCode}
                    size={spacing.xxl}
                    style={{ backgroundColor: 'transparent' }} />
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    surface: {
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        backgroundColor: 'transparent',
    },
});
