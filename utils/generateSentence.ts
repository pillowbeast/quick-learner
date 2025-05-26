import Constants from 'expo-constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'openai_api_key';

// Interface for sentence response
interface SentenceResponse {
  en: string;
  it: string;
}

// Interface for cached sentences
interface CachedSentences {
  [key: string]: SentenceResponse;
}

// OpenAI API response type
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string | null;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Get the API key from secure storage
const getApiKey = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving API key');
    return null;
  }
};

/**
 * Generate a sentence for a given word using OpenAI API
 * @param word The word to generate a sentence for
 * @param iso The language ISO code (default: 'it' for Italian)
 * @returns A promise that resolves to an object with English and translated sentences
 */
export async function buildSentence(word: string, iso = 'it'): Promise<SentenceResponse> {
  try {
    // Extract actual word if timestamp is appended (for cache busting)
    const actualWord = word.split('?')[0];
    
    // Check cache first
    const cachedSentence = await getSentenceFromCache(actualWord);
    if (cachedSentence && !word.includes('?t=')) { // Skip cache if timestamp param is present
      return cachedSentence;
    }
    
    console.log('Generating new sentence for:', actualWord);
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not found. Please set it in the settings.');
    }

    // Note explicitly mentioning JSON in the prompt as required by JSON mode
    const systemPrompt = "You are a helpful assistant designed to output JSON. Respond with valid JSON only.";
    const userPrompt = `Write a short sentence (≤10 words) that naturally includes the word "${actualWord}". 
    Then translate that entire sentence to ${iso === 'it' ? 'Italian' : iso}. 
    Respond with JSON in this exact format: { "en": "English sentence here", "it": "Translation here" }`;
    
    console.log('Making API request with prompt:', userPrompt);
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    });
    
    const response = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }  // Enable JSON mode
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Log response status for debugging
    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);
    
    // Check if we have a complete response
    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No choices in response from OpenAI');
    }

    const choice = response.data.choices[0];
    
    // Check for incomplete generation
    if (choice.finish_reason !== 'stop') {
      console.warn('Response may be incomplete');
    }

    const content = choice.message.content;
    if (!content) {
      throw new Error('No content in response from OpenAI');
    }

    // Parse the JSON response
    const sentenceData = JSON.parse(content) as SentenceResponse;
    
    // Validate the expected structure
    if (!sentenceData.en || !sentenceData.it) {
      throw new Error('Response is missing required fields (en or it)');
    }
    
    // Cache the result (using the actual word, not with timestamp)
    await cacheSentence(actualWord, sentenceData);
    
    return sentenceData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API request failed:', error.response?.status);
    } else {
      console.error('Failed to generate sentence');
    }
    throw error; // Let the UI handle the error
  }
}

/**
 * Get a cached sentence for a word
 */
async function getSentenceFromCache(word: string): Promise<SentenceResponse | null> {
  try {
    const cachedData = await AsyncStorage.getItem('sentenceCache');
    if (cachedData) {
      const sentences = JSON.parse(cachedData) as CachedSentences;
      return sentences[word] || null;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving from cache');
    return null;
  }
}

/**
 * Cache a sentence for a word
 */
async function cacheSentence(word: string, sentence: SentenceResponse): Promise<void> {
  try {
    const cachedData = await AsyncStorage.getItem('sentenceCache');
    const sentences: CachedSentences = cachedData ? JSON.parse(cachedData) : {};
    
    sentences[word] = sentence;
    
    await AsyncStorage.setItem('sentenceCache', JSON.stringify(sentences));
  } catch (error) {
    console.error('Error saving to cache');
  }
} 