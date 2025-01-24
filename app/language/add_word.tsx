import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, Banner } from 'react-native-paper';
import { addWord } from '@/hooks/useDatabase';
import { useNavigationHelper } from '@/hooks/useNavigation';

import AppHeader from '@/components/AppHeader';
import TopBar from '@/components/TopBar';
import Category from '@/components/Category';
import BottomBar from '@/components/BottomBar';
import { useNavigation } from 'expo-router';

export default function AddWordPage() {
  const [type, setType] = useState('');
  const [term, setTerm] = useState('');
  const [translation, setTranslation] = useState('');
  const [present, setPresent] = useState('');
  const [visible, setVisible] = useState(false);

  const { goBack } = useNavigationHelper();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [visible]);
  
  return (
    <>
      {visible && (
        <Banner visible={visible} elevation={5} style={[styles.banner, { backgroundColor: 'green' }]}>
          Word added successfully!
        </Banner>
      )}
      <View style={styles.container}>
        <TopBar />
        <Category name='Type' />
        <TextInput label={'Type'} value={type} onChangeText={setType} />
        <Category name='Term' />
        <TextInput label={'Term'} value={term} onChangeText={setTerm} />
        <Category name='Translation' />
        <TextInput label={'Translation'} value={translation} onChangeText={setTranslation} />
        <Category name='Present' />
        <TextInput label={'Present'} value={present} onChangeText={setPresent} />
        <Button mode='contained' onPress={async () => {
          const result = await addWord({ type, term, translation });
          if (result) {
            setType('');
            setTerm('');
            setTranslation('');
            setPresent('');
            console.log('Word added successfully!');
            setVisible(true);
          } else {
            console.log('Failed to add word');
          }
          
        }}>
          Add Word
        </Button>
        <BottomBar />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    top: 0,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  banner: {
    position: 'absolute',  // ✅ Absolute position so it's above everything
    top: 50,
    left: 0,
    right: 0,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 999, // ✅ Higher z-index to be above other elements
  },
});