import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigationHelper } from "@/hooks/useNavigation";

import TopBar from "@/components/TopBar";
import BottomBar from '@/components/BottomBar';
import Flag from '@/components/Flag';
import Category from '@/components/Category';
import Lists from '@/components/Lists';

export default function LanguagePage() {
  return (
    <View style={styles.container}>
      <TopBar />
      <View style={{justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <Text>English</Text>
        <Flag iso="gb" />
        <Category name="Lists" />
        <Lists names={["Colors", "Numbers", "Greetings"]} />
      </View>
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