// src/components/CategoryCard.tsx

import { Image, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { getImageUri } from '@/utils/getImageUri';
import React from 'react';

// import { getImageUri } from '../utils/getImageUri'; // <-- import

interface Props {
  name: string;
  imageUrl: string;
  onPress: () => void;
  hasList?: boolean;
  width?: number;
  minHeight?: number;
  iconSize?: number;
  fontSize?: number;
}

export default function CategoryCard({ name, imageUrl, onPress, hasList, width, minHeight, iconSize = 64, fontSize = 16 }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        width !== undefined && { width },
        minHeight !== undefined && { minHeight },
        hasList && styles.cardHasList,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: getImageUri(imageUrl) }}
        style={[styles.icon, { width: iconSize, height: iconSize }]}
        resizeMode="contain"
      />
      <Text style={[styles.label, { fontSize }]}>{name}</Text>
      {hasList && <Text style={styles.badge}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  cardHasList: {
    backgroundColor: '#DCFCE7', // light green
    borderWidth: 1,
    borderColor: '#22C55E',
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
  badge: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: '#22C55E',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 6,
    fontSize: 14,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
});
