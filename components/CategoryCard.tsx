// src/components/CategoryCard.tsx

import { Image, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { getImageUri } from '@/utils/getImageUri';
import React from 'react';

// import { getImageUri } from '../utils/getImageUri'; // <-- import

interface Props {
  name: string;
  imageUrl: string;
  onPress: () => void;
}

export default function CategoryCard({ name, imageUrl, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
       <Image
         source={{ uri: getImageUri(imageUrl) }} // <-- on passe par le helper
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.label}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    // 48% pour deux colonnes avec un petit gap
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 16,
    // ombre (mobile vs web)
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 4px rgba(0,0,0,0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
      },
    }),
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
