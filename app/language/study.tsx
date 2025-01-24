import { View, Text, StyleSheet, Image } from 'react-native';
import { IconButton, FAB, Button } from 'react-native-paper';
import { useNavigationHelper } from "@/hooks/useNavigation";

import TopBar from "@/components/TopBar";
import BottomBar from '@/components/BottomBar';
import Category from '@/components/Category';
import List from '@/components/List';

export default function StudyPage() {
  const { goToWrite } = useNavigationHelper();
  const { goToMemorize } = useNavigationHelper();

  return (
    <View style={styles.container}>
      <TopBar />
      <Button onPress={goToWrite}>Write</Button>
      <Button onPress={goToMemorize}>Memorize</Button>
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