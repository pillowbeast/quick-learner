import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigationHelper } from '@/hooks/useNavigation';
import { addLanguage, getLanguages } from '@/hooks/useDatabase';
import Flag from '@/components/Flag';

export default function LanguageSelector() {
  const [language, setLanguage] = useState("");
  const [iso, setIso] = useState("");
  const [languages, setLanguages] = useState<{ id: number; name: string; iso: string }[]>([]);
  const { goToLanguage } = useNavigationHelper();

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is still mounted

    const fetchLanguages = async () => {
      const langs = await getLanguages();
      if (isMounted) {
        setLanguages(langs);
      }
    };

    fetchLanguages();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates
    };
  }, []);

  return (
    <View style={styles.container}>
      {languages.map(({id, name, iso}) => (
        <Button key={id} style={styles.button} mode="contained" onPress={() => goToLanguage(iso, name)}>
          <Flag iso={iso}/>
        </Button>
      ))}
      <TextInput placeholder="Enter language" value={language} onChangeText={setLanguage} />
      <TextInput placeholder="ISO Code" value={iso} onChangeText={setIso} />
      <Button 
        style={styles.button} 
        mode="contained" 
        onPress={
          async () => { 
            await addLanguage(language, iso);
            const updatedLanguages = await getLanguages();
            setLanguages(updatedLanguages);
        }}
      >
        Add Language
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  button: {
    margin: 0,
    borderRadius: 10,
    width: '23%',
    height: 40,
    padding: 0,
  },
  text: {
    margin: 0,
  },
});