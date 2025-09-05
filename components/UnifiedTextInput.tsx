import React, { useState, useRef } from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps, Animated } from 'react-native';

import { useAppTheme } from '@/styles/ThemeContext';
import { spacing, typography, radii } from '@/styles/tokens';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

interface UnifiedTextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function UnifiedTextInput({
  label,
  value,
  onChangeText,
  style,
  inputStyle,
  labelStyle,
  helperText,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  ...textInputProps
}: UnifiedTextInputProps) {
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

  const hasValue = value.length > 0;
  const isLabelFloating = isFocused || hasValue;

  // State of the input
  const handleFocus = () => {
    setIsFocused(true);
    growText(textinputScale, typography.body.fontSize);
    shrinkText(labelScale, typography.mini.fontSize);
  };
  const handleBlur = () => {
    setIsFocused(false);
    shrinkText(textinputScale, typography.caption.fontSize);
    if (!hasValue) {
      growText(labelScale, typography.caption.fontSize);
    }
  };

  // Handles the label press
  const handleLabelPress = () => {
    inputRef.current?.focus();
  };

  // Colors based on State
  const borderColor = isFocused 
      ? colors.primary 
      : colors.muted;
  const labelColor = isFocused 
      ? colors.primary 
      : colors.muted;
  
  // Animation of growing/shrinking text
  const [textinputScale] = useState(new Animated.Value(typography.body.fontSize));
  const [labelScale] = useState(new Animated.Value(typography.caption.fontSize));
  const growText = (textScale: Animated.Value, bigSize: number) => {
    Animated.timing(textScale, {
      toValue: bigSize,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const shrinkText = (textScale: Animated.Value, smallSize: number) => {
    Animated.timing(textScale, {
      toValue: smallSize,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Returns the component
  return (
    <View style={[styles.container, style]}>
      {/* Adds label to the top of the input */}
      {label && (
        <AnimatedText
          style={[
            styles.label,
            {
              color: labelColor,
              fontSize: labelScale,
              top: isLabelFloating ? spacing.sm : spacing.md,
            },
            labelStyle,
          ]}
          onPress={handleLabelPress}
        >
          {label}
        </AnimatedText>
      )}
      
      {/* Main Text Input based on RNTextInput */}
      <AnimatedTextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        cursorColor={colors.accent}
        selectionColor={colors.accent}
        style={[
          styles.input,
          {
            borderColor,
            backgroundColor: disabled ? colors.background : colors.elevated,
            color: colors.text,
            paddingTop: label && isLabelFloating ? spacing.lg : spacing.md,
            minHeight: multiline ? 80 : 48,
            fontSize: textinputScale,
          },
          inputStyle,
        ]}
        placeholderTextColor={colors.muted}
        {...textInputProps}
      />
      
      {/* Adds helper text the the bottom of the input */}
      {(helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: colors.muted,
            },
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    textAlignVertical: 'top',
    fontSize: typography.body.fontSize,
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
    fontSize: typography.caption.fontSize,
  },
});
