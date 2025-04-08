import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useDatabase } from '@/hooks/useDatabase.tsx';
import { languageConfigs } from '@/types/languages';
import { Language } from '@/hooks/useNavigationContext';
import Flag from '@/components/Flag';


export default function AddLanguagePage() {
    const theme = useTheme();
    const { goHomeReplace } = useNavigationHelper();
    const database = useDatabase();

    const [existingLanguages, setExistingLanguages] = useState<Language[]>([]);
    const [isAdding, setIsAdding] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLanguages = async () => {
            try {
                setIsLoading(true);
                const languages = await database.getAllLanguages();
                setExistingLanguages(languages);
            } catch (error) {
                console.error('Error loading languages:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (!database.isLoading) {
            loadLanguages();
        }
    }, [database.isLoading]);

    const handleAddLanguage = async (iso: string, name: string) => {
        setIsAdding(iso);
        try {
            const result = await database.addLanguage(iso, name);
            if (result) {
                goHomeReplace();
            }
        } catch (error) {
            console.error('Error adding language:', error);
        } finally {
            setIsAdding(null);
        }
    };

    // Get available languages from languageConfigs
    const availableLanguages = Object.entries(languageConfigs).map(([iso, config]) => ({
        iso,
        name: config.name
    }));
    console.log('Available languages:', availableLanguages);

    if (database.isLoading || isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading languages...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Surface style={styles.header} elevation={0}>
                <Text variant="headlineMedium" style={styles.title}>Add New Language</Text>
            </Surface>

            <FlatList
                data={availableLanguages}
                keyExtractor={(language) => language.iso}
                renderItem={({ item: language }) => {
                    const isAdded = existingLanguages.some(existing => existing.iso === language.iso);
                    return (
                        <Surface 
                            style={[
                                styles.card, 
                                { 
                                    backgroundColor: theme.colors.surface,
                                    opacity: isAdded ? 0.7 : 1
                                }
                            ]} 
                            elevation={1}
                        >
                            <View style={styles.languageInfo}>
                                <Flag iso={language.iso} />
                                <Text style={styles.name}>{language.name}</Text>
                            </View>
                            <Button
                                mode="contained"
                                onPress={() => handleAddLanguage(language.iso, language.name)}
                                style={styles.button}
                                loading={isAdding === language.iso}
                                disabled={isAdded || isAdding !== null}
                            >
                                {isAdded ? 'Added' : 'Add'}
                            </Button>
                        </Surface>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
    },
    header: {
        padding: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        margin: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    languageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    flag: {
        fontSize: 24,
        marginRight: 16,
    },
    name: {
        fontSize: 16,
    },
    button: {
        marginLeft: 16,
    },
}); 