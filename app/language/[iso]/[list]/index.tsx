import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { IconButton, FAB } from 'react-native-paper';
import { useNavigationHelper } from "@/hooks/useNavigation";

import TopBar from "@/components/TopBar";
import BottomBar from '@/components/BottomBar';
import Category from '@/components/Category';

export default function ListPage() {
  const { goBack } = useNavigationHelper();
  const { goToStudy } = useNavigationHelper();
  const { goToAddWord } = useNavigationHelper();

  return (
    <ScrollView>
      <View style={styles.container}>
        <TopBar />
        <View>
          <Category name="My Vocabulary" />
          <IconButton icon="pencil" mode="contained" onPress={() => {console.log('Edit word pressed!')}}/>
          <IconButton icon="plus" mode="contained" onPress={() => {console.log('Add new word pressed!')}}/>
        </View>
        <FAB icon="plus" onPress={() => goToAddWord()} style={styles.fab_add}/>
        <FAB icon="play" onPress={goToStudy} style={styles.fab_play}/>
        <BottomBar />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab_add: {
    position: 'absolute',
    margin: 16,
    right: 50,
    bottom: 150,
  },
  fab_play: {
    position: 'absolute',
    margin: 16,
    right: 50,
    bottom: 50,
  },
});