import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Menu } from 'react-native-paper';
import { useNavigationContext } from '@/hooks/useNavigationContext';
import { availableLanguages, getDisplayLanguage } from '@/i18n';
import Flag from '@/components/Flag';

export default function DisplayLanguageSelector() {
  const { state, setDisplayLanguage } = useNavigationContext();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLanguageChange = async (iso: string) => {
    await setDisplayLanguage(iso);
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Pressable onPress={openMenu} style={styles.flagButton}>
            <Flag iso={state.displayLanguage} />
          </Pressable>
        }
        contentStyle={styles.menuContent}
      >
        {Object.keys(availableLanguages).map((iso) => (
          <Pressable
            key={iso}
            onPress={() => {
              handleLanguageChange(iso);
              closeMenu();
            }}
            style={styles.menuItem}
          >
            <Flag iso={iso} />
          </Pressable>
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  flagButton: {
    padding: 8,
  },
  menuContent: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: 4,
    gap: 4,
  },
  menuItem: {
    padding: 2,
  },
}); 