// src/components/ui/TextInput.tsx

import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

import Colors from '@/constants/Colors'
import { useThemeMode } from '@/context/ThemeContext'
import React from 'react'

type TextInputProps = RNTextInputProps & {
  style?: ViewStyle
  error?: string
}

export function TextInput({ style, error, ...props }: TextInputProps) {
  const { mode } = useThemeMode()
  const borderColor = error ? Colors[mode].secondary : Colors[mode].neutralMedium
  const placeholderTextColor = Colors[mode].textSecondary
  const backgroundColor = Colors[mode].card
  const textColor = Colors[mode].textPrimary

  return (
    <View style={styles.container}>
      <RNTextInput
        style={[
          styles.input,
          { borderColor, backgroundColor, color: textColor },
          style,
        ]}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
      {error ? <Text style={[styles.error, { color: Colors[mode].secondary }]}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  } as ViewStyle,
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Roboto',
  } as TextStyle,
  error: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  } as TextStyle,
})
