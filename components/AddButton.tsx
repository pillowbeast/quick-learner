import { entryStyles } from "@/styles/entryStyles";
import { TouchableOpacity, Text, View } from "react-native";
import { IconButton, Surface } from "react-native-paper";

interface AddButtonProps {
  onPress: () => void;
  onLongPress: () => void;
}

export default function AddButton({ onPress, onLongPress }: AddButtonProps) {
  return (
    <Surface 
      style={entryStyles.card}
    >
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={{width: '100%'}}>
        <View style={entryStyles.cardContent}>
          <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <IconButton icon="plus" size={24} style={entryStyles.iconButton}/>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  )
}

