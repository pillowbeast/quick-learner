import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, Chip, List } from 'react-native-paper';
import { WordType, WordProperties, PropertyType } from '@/types/word';
import { languageConfigs } from '@/types/languages';

interface WordFormProps {
  type: WordType;
  config: typeof languageConfigs.en;
  initialWord?: string;
  initialTranslation?: string;
  initialExample?: string;
  initialProperties?: WordProperties;
  onSubmit: (word: string, translation: string, example: string | undefined, properties: WordProperties) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
}

export default function WordForm({
  type,
  config,
  initialWord = '',
  initialTranslation = '',
  initialExample = '',
  initialProperties = {},
  onSubmit,
  onCancel,
  submitButtonText = 'Add Word'
}: WordFormProps) {
  const [word, setWord] = useState(initialWord);
  const [translation, setTranslation] = useState(initialTranslation);
  const [example, setExample] = useState(initialExample);
  const [properties, setProperties] = useState<WordProperties>(initialProperties);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedConjugations, setExpandedConjugations] = useState<string[]>([]);

  const handlePropertyChange = (name: string, value: string | Record<string, string>, type: PropertyType) => {
    setProperties(prev => ({
      ...prev,
      [name]: {
        name,
        value,
        type
      }
    }));
  };

  const handleSubmit = async () => {
    if (!word || !translation) {
      setError('Word and translation are required');
      return;
    }

    // Check required properties
    const wordTypeConfig = config.wordTypes.find((wt: { type: WordType }) => wt.type === type);
    if (!wordTypeConfig) {
      setError('Invalid word type');
      return;
    }

    const requiredProperties = wordTypeConfig.properties
      .filter((prop: { isRequired: boolean }) => prop.isRequired)
      .map((prop: { name: string }) => prop.name);

    const missingProperties = requiredProperties.filter(field => {
      const property = properties[field];
      return !property || !property.value || 
        (typeof property.value === 'string' && property.value.trim() === '') ||
        (typeof property.value === 'object' && Object.keys(property.value).length === 0);
    });

    if (missingProperties.length > 0) {
      setError(`Please fill in all required fields: ${missingProperties.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(word, translation, example || undefined, properties);
    } catch (error) {
      console.error('Error submitting word:', error);
      setError('Failed to submit word. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConjugationExpand = (name: string) => {
    setExpandedConjugations(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const renderField = (property: { name: string; type: PropertyType; options?: string[]; persons?: Record<string, string>; isRequired: boolean }) => {
    const currentProperty = properties[property.name];
    const currentValue = currentProperty?.value || '';
    
    if (property.type === 'text') {
      return (
        <TextInput
          key={property.name}
          label={property.name}
          value={currentValue as string}
          onChangeText={(text) => handlePropertyChange(property.name, text, property.type)}
          style={styles.input}
        />
      );
    } else if (property.type === 'select' && property.options) {
      return (
        <View key={property.name} style={styles.fieldContainer}>
          <Text style={styles.label}>{property.name}</Text>
          <View style={styles.chipContainer}>
            {property.options.map((option) => (
              <Chip
                key={option}
                selected={(currentValue as string) === option}
                onPress={() => {
                  const newValue = (currentValue as string) === option ? '' : option;
                  handlePropertyChange(property.name, newValue, property.type);
                }}
                style={styles.chip}
              >
                {option}
              </Chip>
            ))}
          </View>
        </View>
      );
    } else if (property.type === 'conjugation' && property.persons) {
      const conjugationValue = currentValue as Record<string, string> || {};
      const isExpanded = expandedConjugations.includes(property.name);
      
      return (
        <View key={property.name} style={styles.fieldContainer}>
          <List.Accordion
            title={property.name}
            expanded={isExpanded}
            onPress={() => handleConjugationExpand(property.name)}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            {Object.entries(property.persons).map(([person, label]) => (
              <TextInput
                key={person}
                label={label}
                value={conjugationValue[person] || ''}
                onChangeText={(text) => {
                  const newValue = { ...conjugationValue, [person]: text };
                  handlePropertyChange(property.name, newValue, property.type);
                }}
                style={styles.accordionInput}
              />
            ))}
          </List.Accordion>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Surface style={styles.header} elevation={1}>
            <Text variant="headlineSmall" style={styles.title}>
              {initialWord ? 'Edit' : 'Add'} {type?.charAt(0).toUpperCase() + type?.slice(1)}
            </Text>
          </Surface>

          <View style={styles.content}>
            <View>
              <TextInput
                label="Word"
                value={word}
                onChangeText={setWord}
                style={styles.input}
              />
              <TextInput
                label="Translation"
                value={translation}
                onChangeText={setTranslation}
                style={styles.input}
              />
              <TextInput
                label="Example (optional)"
                value={example}
                onChangeText={setExample}
                multiline
                style={styles.input}
              />

              {error && (
                <Text style={styles.error}>{error}</Text>
              )}
            </View>

            <View style={{ height: 16 }} />
            <View style={{ height: 3, backgroundColor: 'grey' }} />
            <View style={{ height: 24 }} />

            {type && config.wordTypes
              .find((wt: { type: WordType }) => wt.type === type)?.properties
              .sort((a, b) => {
                const typeOrder = { 'text': 0, 'select': 1, 'conjugation': 2 };
                return typeOrder[a.type] - typeOrder[b.type];
              })
              .map((property: { name: string; type: PropertyType; options?: string[]; persons?: Record<string, string>; isRequired: boolean }) => renderField(property))
            }
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <View style={[styles.buttonContainer, onCancel ? styles.buttonContainerWithCancel : null]}>
        {onCancel && (
          <Button
            mode="outlined"
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
          >
            Cancel
          </Button>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.button}
        >
          {submitButtonText}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  input: {
    marginBottom: 8,
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  fieldContainer: {
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  buttonContainerWithCancel: {
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  accordion: {
    backgroundColor: 'transparent',
    padding: 0,
    minHeight: 40,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionInput: {
    fontSize: 14,
    marginBottom: 4,
    height: 40,
  },
}); 