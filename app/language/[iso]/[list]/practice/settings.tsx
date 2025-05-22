import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SegmentedButtons, Switch, Button, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { useNavigationContext } from '@/hooks/useNavigationContext';
import { WordType } from '@/types/word';
import { languageConfigs } from '@/types/languages';
import { useDatabase } from '@/hooks/useDatabase';

interface PracticeSettings {
  wordCount: number;
  proficiencyMode: 'all' | 'unknown' | 'known';
  wordTypes: WordType[];
  useSpacedRepetition: boolean;
  targetProficiency: number;
}

export default function PracticeSettings() {
  const { goToMemorize } = useNavigationHelper();
  const { state } = useNavigationContext();
  const database = useDatabase();
  const config = languageConfigs[state.currentLanguage?.iso || 'en'] || languageConfigs.en;

  const [availableWords, setAvailableWords] = useState<number>(0);
  const [settings, setSettings] = useState<PracticeSettings>({
    wordCount: 20,
    proficiencyMode: 'all',
    wordTypes: config.wordTypes.map(wt => wt.type),
    useSpacedRepetition: true,
    targetProficiency: 50,
  });

  useEffect(() => {
    const loadAvailableWords = async () => {
      if (!state.currentList?.uuid) return;
      
      const words = await database.getWordsByList(state.currentList.uuid);
      const filteredWords = words.filter(word => 
        settings.wordTypes.includes(word.type)
      );
      setAvailableWords(filteredWords.length);
    };

    loadAvailableWords();
  }, [state.currentList?.uuid, settings.wordTypes, database]);

  const handleWordCountChange = useCallback((value: number) => {
    setSettings(prev => ({
      ...prev,
      wordCount: Math.round(value)
    }));
  }, []);

  const handleProficiencyChange = useCallback((value: number) => {
    setSettings(prev => ({
      ...prev,
      targetProficiency: Math.round(value)
    }));
  }, []);

  const handleStartPractice = () => {
    if (!state.currentLanguage?.iso || !state.currentList?.name) {
      return;
    }

    goToMemorize({
      settings: JSON.stringify(settings)
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Word Count</Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={20}
              onValueChange={handleWordCountChange}
              minimumValue={5}
              maximumValue={Math.min(50, Math.max(50, availableWords))}
              step={1}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#3B82F6"
            />
            <Text style={styles.sliderValue}>{settings.wordCount} words</Text>
            <Text style={styles.availableWords}>Available: {Math.min(50, Math.max(50, availableWords))} words</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Proficiency</Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={50}
              onValueChange={handleProficiencyChange}
              minimumValue={0}
              maximumValue={100}
              step={1}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#3B82F6"
            />
            <Text style={styles.sliderValue}>{settings.targetProficiency}%</Text>
            <Text style={styles.availableWords}>Target mean proficiency level</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proficiency Mode</Text>
          <SegmentedButtons
            value={settings.proficiencyMode}
            onValueChange={(value) => setSettings(prev => ({ ...prev, proficiencyMode: value as 'all' | 'unknown' | 'known' }))}
            buttons={[
              { value: 'all', label: 'All Words' },
              { value: 'unknown', label: 'Unknown' },
              { value: 'known', label: 'Known' },
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Word Types</Text>
          {config.wordTypes.map((type) => (
            <View key={type.type} style={styles.wordTypeRow}>
              <Switch
                value={settings.wordTypes.includes(type.type)}
                onValueChange={(value) => {
                  setSettings(prev => ({
                    ...prev,
                    wordTypes: value
                      ? [...prev.wordTypes, type.type]
                      : prev.wordTypes.filter(t => t !== type.type)
                  }));
                }}
              />
              <IconButton
                icon={type.icon}
                size={24}
                onPress={() => {}}
                style={styles.wordTypeIcon}
              />
              <Text style={styles.wordTypeLabel}>
                {type.type}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spaced Repetition</Text>
          <View style={styles.switchRow}>
            <Switch
              value={settings.useSpacedRepetition}
              onValueChange={(value) => setSettings(prev => ({ ...prev, useSpacedRepetition: value }))}
            />
            <Text style={styles.switchLabel}>Use spaced repetition</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleStartPractice}
          style={styles.startButton}
        >
          Start Practice
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F2937',
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: 8,
    color: '#6B7280',
  },
  availableWords: {
    textAlign: 'center',
    marginTop: 4,
    color: '#9CA3AF',
    fontSize: 12,
  },
  wordTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordTypeLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  startButton: {
    borderRadius: 8,
  },
  wordTypeIcon: {
    marginRight: 8,
  },
}); 