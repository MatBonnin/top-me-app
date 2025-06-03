// src/components/ui/ListInput.tsx

import { TextInput as RNTextInput, StyleProp, StyleSheet, TextInputProps, TextStyle, View } from 'react-native'

import Colors from '@/constants/Colors'
import { useThemeMode } from '@/context/ThemeContext'
import React from 'react'

type ListInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>   // ← ici on précise StyleProp<TextStyle>
}

export function ListInput({ style, ...props }: ListInputProps) {
  const { mode } = useThemeMode()
  const textColor = Colors[mode].textPrimary

  return (
    <View style={styles.container}>
      <RNTextInput
        placeholderTextColor={Colors[mode].textSecondary}
        style={[
          styles.input,
          { color: textColor },
          style,
        ]}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 22,
    height: 64,
    paddingHorizontal: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
})
