import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Carousel from 'react-native-reanimated-carousel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Slide {
    icon: string;
    title: string;
    description: string;
}

const slides: Slide[] = [
    {
        icon: 'book-open-variant',
        title: 'Learn Languages',
        description: 'Start by adding a language you want to learn. We support multiple languages with their unique characteristics.',
    },
    {
        icon: 'format-list-bulleted',
        title: 'Create Word Lists',
        description: 'Organize your vocabulary into lists. Create lists for different topics, difficulty levels, or any other category you prefer.',
    },
    {
        icon: 'plus-circle',
        title: 'Add Words',
        description: 'Add words with translations, examples, and additional properties specific to each language.',
    },
    {
        icon: 'lightbulb',
        title: 'Practice & Memorize',
        description: 'Use our practice and memorization tools to reinforce your learning. Track your progress and improve your vocabulary.',
    },
];

export default function OnboardingScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleGetStarted = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            router.replace('/home');
        } catch (error) {
            console.error('Error setting onboarding status:', error);
            // Still navigate to home even if setting the flag fails
            router.replace('/home');
        }
    };

    const renderItem = ({ item, index }: { item: Slide; index: number }) => (
        <View style={[styles.slide, { backgroundColor: theme.colors.background }]}>
            <MaterialCommunityIcons
                name={item.icon as any}
                size={80}
                color={theme.colors.primary}
                style={styles.icon}
            />
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
                {item.title}
            </Text>
            <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onBackground }]}>
                {item.description}
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Carousel
                loop={false}
                width={width}
                height={width * 1.2}
                data={slides}
                scrollAnimationDuration={1000}
                onSnapToItem={(index: number) => setCurrentIndex(index)}
                renderItem={renderItem}
            />
            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {slides.map((_, index: number) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                {
                                    backgroundColor: index === currentIndex
                                        ? theme.colors.primary
                                        : theme.colors.outline,
                                },
                            ]}
                        />
                    ))}
                </View>
                <Button
                    mode="contained"
                    onPress={handleGetStarted}
                    style={styles.button}
                >
                    Get Started
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