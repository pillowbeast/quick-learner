import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  backgroundColor?: string;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  excludeEdges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

/**
 * A wrapper component that provides safe area insets for content
 * to avoid notches, cameras, home indicators, etc.
 */
const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  contentStyle,
  backgroundColor = '#fff',
  edges = ['top', 'right', 'bottom', 'left'],
  excludeEdges = [],
}) => {
  const insets = useSafeAreaInsets();
  
  // Filter out excluded edges
  const safeEdges = edges.filter(edge => !excludeEdges.includes(edge));
  
  // Calculate padding based on insets and edges
  const padding = {
    paddingTop: safeEdges.includes('top') ? insets.top : 0,
    paddingRight: safeEdges.includes('right') ? insets.right : 0,
    paddingBottom: safeEdges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: safeEdges.includes('left') ? insets.left : 0,
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor },
      style
    ]}>
      <View style={[
        styles.content,
        padding,
        contentStyle
      ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default SafeAreaWrapper; 