import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { Word, SentenceData } from '@/hooks/database/types';
import { buildSentence } from '@/utils/generateSentence';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import * as wordDb from '@/hooks/database/word';

export default function SentencePractice() {
  const params = useLocalSearchParams();
  const [sentences, setSentences] = useState<SentenceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const wordUuids = useMemo(() => {
    return params.words ? JSON.parse(params.words as string) as string[] : [];
  }, [params.words]);

  const loadWordsAndSentences = useCallback(async () => {
    if (wordUuids.length === 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      const wordPromises = wordUuids.map(uuid => wordDb.getWord(uuid));
      const words = (await Promise.all(wordPromises)).filter((word): word is Word => word !== null);

      const initialSentences = words.map((word: Word) => ({
        word,
        wordText: '',
        translation: '',
        isLoading: true,
        error: null
      }));
      
      setSentences(initialSentences);
      
      const sentencePromises = words.map(async (word) => {
        try {
          const sentenceData = await buildSentence(word.word);
          
          return {
            word,
            wordText: sentenceData.en,
            translation: sentenceData.it,
            isLoading: false,
            error: null
          };
        } catch (error) {
          console.error('Failed to generate sentence for word:', word.word);
          
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate sentence';
          return {
            word,
            wordText: '',
            translation: '',
            isLoading: false,
            error: errorMessage
          };
        }
      });

      const results = await Promise.all(sentencePromises);
      setSentences(results);
    } catch (error) {
      console.error('Error loading words');
    } finally {
      setIsLoading(false);
    }
  }, [wordUuids]);

  React.useEffect(() => {
    loadWordsAndSentences();
  }, [loadWordsAndSentences]);

  if (isLoading && sentences.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading sentences...</Text>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        {sentences.map((sentence, index) => (
          <View key={index} style={styles.sentenceContainer}>
          <Text style={styles.word}>{sentence.word.word}</Text>
          {sentence.isLoading ? (
            <Text>Generating sentence...</Text>
          ) : sentence.error ? (
            <Text style={styles.error}>{sentence.error}</Text>
          ) : (
            <>
              <Text style={styles.sentence}>{sentence.wordText}</Text>
              <Text style={styles.translation}>{sentence.translation}</Text>
            </>
          )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sentenceContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sentence: {
    fontSize: 16,
    marginBottom: 8,
  },
  translation: {
    fontSize: 16,
    color: '#666',
  },
  error: {
    color: 'red',
  },
}); 