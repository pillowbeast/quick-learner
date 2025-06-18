import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigationHelper } from '@/hooks/useNavigation';
import i18n from '@/i18n';
import { useAppTheme } from '@/styles/ThemeContext';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { spacing, typography } from '@/styles/tokens';
import { Button } from '@/components/UnifiedButton';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = '@quick_learner_onboarding_complete';

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
    const { goHomeReplace } = useNavigationHelper();
    const [currentIndex, setCurrentIndex] = useState(0);
    const { colors } = useAppTheme();

    const handleComplete = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            goHomeReplace();
        } catch (error) {
            console.error('Error saving onboarding status:', error);
            // Still navigate to home even if saving fails
            goHomeReplace();
        }
    };

    return (
        <SafeAreaWrapper backgroundColor={colors.background}>
            <View style={styles.carousel}>
                <Carousel
                    loop={false}
                    width={width}
                    data={slides}
                    onSnapToItem={setCurrentIndex}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={64}
                                color={colors.primary}
                                style={styles.icon}
                            />
                            <Text style={[typography.subheader, { color: colors.text, textAlign: 'center' }]}>
                                {item.title}
                            </Text>
                            <Text style={[typography.body, { color: colors.text, textAlign: 'center' }]}>
                                {item.description}
                            </Text>
                        </View>
                    )}
                />
            </View>
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
                                            ? colors.primary
                                            : colors.muted,
                                },
                            ]}
                        />
                    ))}
                </View>
                <Button
                    onPress={handleComplete}
                    style={{backgroundColor: colors.primary, width: '80%'}}
                    textStyle={{color: colors.onPrimaryOrSecondary}}
                >
                    {i18n.t('got_it')}
                </Button>
            </View>
        </SafeAreaWrapper>
    );
}

const styles = StyleSheet.create({
    carousel: {
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
        alignItems: 'center',
        paddingBottom: spacing.xl,
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
}); 