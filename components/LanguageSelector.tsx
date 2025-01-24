import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function LanguageSelector({ country_lists }: { country_lists: string[] }) {
  const router = useRouter();

  function movetoLanguage() {
    router.push("/language");
  }

  return (
    <View style={styles.container}>
      {country_lists.map((country, index) => (
        <Button key={index} style={styles.button} mode="contained" onPress={movetoLanguage}>
          {country}
        </Button>
      ))}
      <Button style={styles.button} mode="contained" onPress={movetoLanguage}>
        <Text style={styles.text}>Add Language</Text>
      </Button>
      <Pressable style={styles.button} onPress={movetoLanguage}>
        <Text style={styles.text}>Press me</Text>
      </Pressable>
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