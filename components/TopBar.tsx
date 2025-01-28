import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { Dimensions, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { useNavigationHelper } from '@/hooks/useNavigation';

const window_width = Dimensions.get('window').width;
const window_height = Dimensions.get('window').height;

export default function TopBar() {
  const { goHomeReplace } = useNavigationHelper();
  const { goBack } = useNavigationHelper();
  const { goToSettings } = useNavigationHelper();
  const { goToProfile } = useNavigationHelper();
  const pathname = usePathname();

  // check where we are
  const isHomeScreen = pathname === '/home';
  const isOneStepFromHome = pathname !== '/home' && pathname.split('/').length === 2;

  return (
    <Appbar.Header style={styles.container}>
      {!isHomeScreen &&(
        <Appbar.BackAction onPress={goBack} />
      )}
      {!isHomeScreen && !isOneStepFromHome && (
        <Appbar.Action icon="home" onPress={goHomeReplace} />
      )}
      {isHomeScreen && (
        <>
          <Appbar .Action icon="cog" onPress={goToSettings} />
          <Appbar.Action icon="account" onPress={goToProfile} />
        </>
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    top: 0,
    left: 0,
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'space-between',
    width: window_width,
    height: 0.1*window_height,
  },
});