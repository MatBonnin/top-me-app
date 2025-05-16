// app/(tabs)/comparaisons.tsx

import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import React from 'react'
import { StyleSheet } from 'react-native'

export default function ComparaisonsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Comparaisons</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
