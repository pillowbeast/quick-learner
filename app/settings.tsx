import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useAppTheme } from '@/styles/ThemeContext';
import i18n from '@/i18n';

import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import UnifiedHeader from '@/components/UnifiedHeader';
import UnifiedButton from '@/components/UnifiedButton';
import UnifiedTextInput from '@/components/UnifiedTextInput';

const API_KEY_STORAGE_KEY = 'openai_api_key';

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      <UnifiedHeader
        title={i18n.t('settings')}
        backButton={true}
        settingsButton={false}
        actions={
          <></>
        }
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('openai_api_key')}</Text>
          <Text style={styles.description}>
            {i18n.t('openai_api_key_explanation')}
          </Text>
          <UnifiedTextInput
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your OpenAI API key"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            label="OpenAI API Key"
            helperText="Your API key will be securely stored on your device"
          />
          
          <View style={styles.buttonContainer}>
            <UnifiedButton
              onPress={handleSaveApiKey}
              style={{
                flex: 1,
                backgroundColor: colors.primary,
              }}
              textStyle={{ color: colors.onPrimaryOrSecondary }}
              disabled={!apiKey}
            >
              {i18n.t('save_api_key')}
            </UnifiedButton>
            <UnifiedButton
              onPress={handleClearApiKey}
              style={{
                flex: 1,
                backgroundColor: colors.error,
              }}
              textStyle={{ color: colors.onPrimaryOrSecondary }}
            >
              {i18n.t('clear_api_key')}
            </UnifiedButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
}); 
