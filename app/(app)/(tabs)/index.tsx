// app/(tabs)/index.tsx

import { Category, fetchCategories } from '@/services/lists';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import CategoryCard from '@/components/CategoryCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useRouter } from 'expo-router';

export default function AccueilScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        TopMe
      </ThemedText>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {categories.map(cat => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              imageUrl={cat.imageUrl!}
              onPress={() => router.push(`../list/create?categoryId=${cat.id}`)}
            />
          ))}
          {/* Si nombres impairs, tu peux ajouter une View vide pour équilibrer la dernière ligne */}
          {categories.length % 2 === 1 && <View style={{ width: '48%' }} />}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
