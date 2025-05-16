// src/components/ui/ListInput.tsx

import { TextInput as RNTextInput, StyleSheet, TextInputProps, View } from 'react-native'

import Colors from '@/constants/Colors'
import { useThemeMode } from '@/context/ThemeContext'
import React from 'react'

type ListInputProps = TextInputProps & {
  style?: object
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
    fontSize: 18,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    //shadow
 

  },
})
