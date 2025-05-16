// components/ui/TextInput.tsx

import {
  TextInput as RNInput,
  TextInputProps as RNTextInputProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native'

import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'

interface TextInputProps extends RNTextInputProps {
  error?: string
  style?: StyleProp<TextStyle>
}

export function TextInput({ error, style, ...props }: TextInputProps) {
  // Récupère la couleur de bordure et de texte selon le thème
  const borderColor = useThemeColor({}, 'border')
  const textColor   = useThemeColor({}, 'textPrimary')

  return (
    <View style={styles.wrapper}>
      <RNInput
        {...props}
        style={[styles.input, { borderColor, color: textColor }, style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  error: {
    color: '#EF4444',
    marginTop: 4,
  },
})
