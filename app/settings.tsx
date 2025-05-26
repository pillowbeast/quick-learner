import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import * as SecureStore from 'expo-secure-store';
import { useNavigationHelper } from '@/hooks/useNavigation';
import BackButton from '@/components/BackButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';

const API_KEY_STORAGE_KEY = 'openai_api_key';

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { goBack } = useNavigationHelper();

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      console.log('Loading API key from secure storage...');
      const storedKey = await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
      console.log('Stored key exists:', !!storedKey);
      if (storedKey) {
        console.log('Stored key length:', storedKey.length);
        console.log('Stored key starts with:', storedKey.substring(0, 4));
        // Show only last 4 characters for security
        setApiKey('•'.repeat(storedKey.length - 4) + storedKey.slice(-4));
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      Alert.alert('Error', 'Failed to load API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    try {
      setIsLoading(true);
      console.log('Saving new API key...');
      console.log('Raw input key length:', apiKey.length);
      
      // Clean the API key by removing any quotes, whitespace, and newlines
      const cleanKey = apiKey
        .trim()
        .replace(/^["']|["']$/g, '') // Remove quotes
        .replace(/\s+/g, '') // Remove all whitespace
        .replace(/\n/g, ''); // Remove newlines
      
      console.log('Cleaned key length:', cleanKey.length);
      console.log('Cleaned key starts with:', cleanKey.substring(0, 4));
      
      // Validate the API key format
      if (!cleanKey.startsWith('sk-')) {
        console.error('Invalid API key format - does not start with sk-');
        Alert.alert('Error', 'Invalid API key format. It should start with "sk-"');
        return;
      }

      console.log('Saving cleaned key to secure storage...');
      await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, cleanKey);
      console.log('API key saved successfully');
      
      Alert.alert('Success', 'API key saved successfully');
      // Show only last 4 characters after saving
      setApiKey('•'.repeat(cleanKey.length - 4) + cleanKey.slice(-4));
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearApiKey = async () => {
    try {
      setIsLoading(true);
      console.log('Clearing API key from secure storage...');
      await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
      console.log('API key cleared successfully');
      setApiKey('');
      Alert.alert('Success', 'API key cleared successfully');
    } catch (error) {
      console.error('Error clearing API key:', error);
      Alert.alert('Error', 'Failed to clear API key');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <BackButton />
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <BackButton />
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OpenAI API Key</Text>
          <Text style={styles.description}>
            Enter your OpenAI API key to enable sentence generation. Your key is stored securely on your device.
          </Text>
          
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your OpenAI API key"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSaveApiKey}
              style={styles.button}
              disabled={!apiKey}
            >
              Save API Key
            </Button>
            
            <Button
              onPress={handleClearApiKey}
              style={styles.clearButton}
            >
              Clear API Key
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 60, // Add space for the back button
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ff4444',
  },
}); 