import { View, StyleSheet } from "react-native";

import { useAppTheme } from "@/styles/ThemeContext";
import { radii } from "@/styles/tokens";

export default function UnifiedSeperator() {
  const { colors } = useAppTheme()
  return (
    <View style={styles.container}>
      <View style={[styles.seperator, { backgroundColor: colors.secondary }]}>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  seperator: {
    opacity: 0.2,
    width: '95%',
    height: 2,
    borderRadius: radii.sm,
  }
});
