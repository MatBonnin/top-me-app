import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native'

import Colors from '@/constants/Colors'
import { useThemeMode } from '@/context/ThemeContext'
import React from 'react'

type ButtonProps = {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { mode } = useThemeMode()
  const backgroundColor =
    variant === 'primary' ? Colors[mode].primary : 'transparent'
  const textColor =
    variant === 'primary' ? '#FFFFFF' : Colors[mode].secondary
  const borderColor =
    variant === 'secondary' ? Colors[mode].secondary : 'transparent'

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor },
        variant === 'secondary' && styles.secondary,
        { opacity: pressed ? 0.9 : 1, transform: [{ translateY: pressed ? -2 : 0 }] },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.6,
  },
})

