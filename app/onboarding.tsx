import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Carousel from 'react-native-reanimated-carousel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';

const { width } = Dimensions.get('window');

interface Slide {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    description: string;
}

const slides: Slide[] = [
    {
        icon: 'book-open-variant',
        title: i18n.t('learn_languages'),
        description: i18n.t('learn_languages_desc'),
    },
    {
        icon: 'format-list-bulleted',
        title: i18n.t('create_lists'),
        description: i18n.t('create_lists_desc'),
    },
    {
        icon: 'plus-circle',
        title: i18n.t('add_words'),
        description: i18n.t('add_words_desc'),
    },
    {
        icon: 'lightbulb',
        title: i18n.t('practice_memorize'),
        description: i18n.t('practice_memorize_desc'),
    },
];

export default function Onboarding() {
    const theme = useTheme();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleComplete = async () => {
        await AsyncStorage.setItem('@quick_learner_onboarding_complete', 'true');
        router.replace('/home');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Carousel
                loop={false}
                width={width}
                height={400}
                data={slides}
                onSnapToItem={setCurrentIndex}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={64}
                            color={theme.colors.primary}
                            style={styles.icon}
                        />
                        <Text variant="headlineMedium" style={styles.title}>
                            {item.title}
                        </Text>
                        <Text variant="bodyLarge" style={styles.description}>
                            {item.description}
                        </Text>
                    </View>
                )}
            />
            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                {
                                    backgroundColor:
                                        currentIndex === index
                                            ? theme.colors.primary
                                            : theme.colors.outline,
                                },
                            ]}
                        />
                    ))}
                </View>
                <Button
                    mode="contained"
                    onPress={handleComplete}
                    style={styles.button}
                >
                    {i18n.t('got_it')}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    button: {
        width: '80%',
    },
}); 