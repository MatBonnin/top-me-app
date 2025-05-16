// app/(app)/(tabs)/index.tsx

import { Category, fetchCategories } from '@/services/lists';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import CategoryCard from '@/components/CategoryCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useRouter } from 'expo-router';

export default function AccueilScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const logo = require('../../../assets/images/logo.png');

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <ThemedText type="title" style={styles.title}>
        Choisissez une catégorie
      </ThemedText>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {categories.map(cat => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              imageUrl={cat.imageUrl!}
              onPress={() => {
                router.push({
                  pathname: '/[categoryId]',
                  params: {
                    categoryId: cat.id,
                    categoryName: cat.name,
                    categoryImage: cat.imageUrl,
                  },
                });
              }}
            />
          ))}
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
  logo: {
    width: 240,
    height: 240,
    alignSelf: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
