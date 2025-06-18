import { TouchableOpacity, View, StyleSheet } from "react-native";
import { IconButton, Surface } from "react-native-paper";

import { entryStyles } from "@/styles/entryStyles";
import { useAppTheme } from "@/styles/ThemeContext";


interface AddButtonProps {
  onPress: () => void;
  onLongPress: () => void;
}

export default function UnifiedAddButton({ onPress, onLongPress }: AddButtonProps) {
  const { colors } = useAppTheme()
  return (
    <Surface 
      style={[entryStyles.card, {backgroundColor: colors.background}]}
      elevation={0}
    >
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={{width: '100%'}}>
        <View style={entryStyles.cardRowContent}>
          <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <IconButton 
              icon="plus-circle" 
              size={24} 
              iconColor={colors.secondary}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  )
}

const styles = StyleSheet.create({

});

