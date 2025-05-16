// app/(tabs)/index.tsx

import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AccueilScreen() {
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Accueil</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
