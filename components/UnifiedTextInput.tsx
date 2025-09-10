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
  // Additional commonly used TextInput props
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  autoFocus?: boolean;
  autoComplete?: 'off' | 'username' | 'password' | 'email' | 'name' | 'tel' | 'street-address' | 'postal-code' | 'cc-number' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year';
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'number-pad' | 'decimal-pad';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  textContentType?: 'none' | 'URL' | 'addressCity' | 'addressCityAndState' | 'addressState' | 'countryName' | 'creditCardNumber' | 'emailAddress' | 'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' | 'nickname' | 'organizationName' | 'postalCode' | 'streetAddressLine1' | 'streetAddressLine2' | 'sublocality' | 'telephoneNumber' | 'username' | 'password' | 'newPassword' | 'oneTimeCode';
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
  autoCapitalize,
  autoCorrect,
  autoFocus,
  autoComplete,
  secureTextEntry,
  keyboardType,
  returnKeyType,
  textContentType,
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
    sizeAnimation(textinputScale, typography.subheader.fontSize);
    sizeAnimation(labelScale, typography.mini.fontSize);
    sizeAnimation(labelSpacing, spacing.xs);
  };
  const handleBlur = () => {
    setIsFocused(false);
    sizeAnimation(textinputScale, typography.body.fontSize);
    if (!hasValue) {
      sizeAnimation(labelScale, typography.body.fontSize);
      sizeAnimation(labelSpacing, spacing.md);
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
  // Label Animation - initialize based on hasValue
  const [labelScale] = useState(new Animated.Value(
    hasValue ? typography.mini.fontSize : typography.caption.fontSize
  ));
  const [labelSpacing] = useState(new Animated.Value(
    hasValue ? spacing.xs : spacing.md
  ));
  const [textinputScale] = useState(new Animated.Value(typography.body.fontSize));
  const sizeAnimation = (oldSize: Animated.Value, newSize: number) => {
    Animated.timing(oldSize, {
      toValue: newSize,
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
              top: labelSpacing,
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
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        autoComplete={autoComplete}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        textContentType={textContentType}
        cursorColor={colors.accent}
        selectionColor={colors.accent}
        scrollEnabled={false}
        rejectResponderTermination={false}
        style={[
          styles.input,
          {
            borderColor,
            backgroundColor: disabled ? colors.background : colors.elevated,
            color: colors.text,
            paddingTop: label && isLabelFloating ? spacing.lg : spacing.md,
            minHeight: 48,
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
    fontSize: typography.mini.fontSize,
  },
});
