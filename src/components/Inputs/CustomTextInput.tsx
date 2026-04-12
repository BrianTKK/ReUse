import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/theme';
import * as Typography from '../Typography/typography';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconRightPress?: () => void;
}

export default function CustomTextInput({
  label,
  iconLeft,
  iconRight,
  onIconRightPress,
  style,
  ...props
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      <Typography.H6 style={styles.label}>{label}</Typography.H6>

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        {/* Left Icon (if provided) */}
        {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}

        {/* Text Input */}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icon (if provided - useful for password visibility) */}
        {iconRight && (
          <TouchableOpacity onPress={onIconRightPress} style={styles.iconRight}>
            {iconRight}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    color: colors.textDark,
    textTransform: 'none', // Overriding the H6 uppercase default if needed, or keep it. Let's make it capitalize properly later if user wants.
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: colors.greenLight, // Or colors.primary based on design. Let's use greenLight or the main green.
  },
  iconLeft: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'PlusJakartaSans_400Regular', // Regular text for input
    fontSize: 14,
    color: colors.textDark,
  },
});
