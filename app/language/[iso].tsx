import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, FAB, Button, TextInput } from 'react-native-paper';

import { getLanguages, getLists, addList } from '@/hooks/useDatabase';

import TopBar from "@/components/TopBar";
import BottomBar from '@/components/BottomBar';
import Category from '@/components/Category';
import Flag from '@/components/Flag';

export default function ListPage() {
  const { iso, name } = useLocalSearchParams();
  const [languageId, setlanguageId] = useState(0);
  const [lists, setLists] = useState<{ name: string }[]>([]);
  const [newlistname, setNewListName] = useState("");

  useEffect(() => {
    getLanguages().then((lang: { iso: string; id: number }[]) => {
      console.log(lang);
      const language = lang.find((l: { iso: string }) => l.iso === iso);
      if (language) {
        setlanguageId(language.id);
      }
    });
    if (languageId) {
      getLists(languageId).then(setLists); // Load words for the selected language
      console.log(lists);
    }
  }, [iso, languageId]);

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={{justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <Text>{name as string}</Text>
        <Flag iso={iso as string} />

        <Category name="My Vocabulary" />
        {lists.map((list) => (
          <Text key={list.name}>{list.name}</Text>
        ))}
      </View>
      <TextInput placeholder="Enter list name" value={newlistname} onChangeText={setNewListName} />
      <Button icon="plus" onPress={async () => {
          const result = await addList(newlistname, languageId);
          console.log(result);
          if (result) {
            setLists([...lists, {name: newlistname}]);
            setNewListName("");
          } else {
            console.log("Failed to add list");
            setNewListName("");
          }
        }}>
        Add List
      </Button>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});