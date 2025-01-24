import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';

export default function Lists( { names }: {names: string[]} ) {
  const { goToList } = useNavigationHelper();

  return (
    <View style={styles.container}>
      <Button style={styles.list} onPress={goToList}>
        <Text style={styles.text}>My Vocabulary</Text>
      </Button>
      {names.map((name) => (
        <Button style={styles.list} onPress={goToList}>
          <Text style={styles.text}>{name}</Text>
        </Button>
      ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    width: '100%',
    gap: 10,
  },
  list: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
  },
  text: {
    fontSize: 24,
  },
});