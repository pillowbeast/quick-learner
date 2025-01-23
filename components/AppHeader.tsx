import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  title?: string;
  subtitle?: string;
};

const AppHeader = ({ title = "Quick Learner!", subtitle = "Welcome to" }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>
        {subtitle}
      </Text>
      <Text style={{ fontSize: 32 }}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }
});

export default AppHeader;