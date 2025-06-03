import { StyleSheet, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import type { SearchInputProps } from '@/interfaces/components/SearchInputProps';

// Utilisation d'une icône vectorielle (expo ou react-native-vector-icons)

export default function SearchInput({ value, onChangeText, style, ...props }: SearchInputProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color="#9CA3AF" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher"
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    // ombre légère
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingVertical: 10,
    color: '#111827',
  },
});
