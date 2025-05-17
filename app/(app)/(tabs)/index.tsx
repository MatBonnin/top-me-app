// app/(app)/(tabs)/index.tsx

import { Category, List, fetchCategories, fetchLists } from '@/services/lists';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import CategoryGrid from '@/components/CategoryGrid';
import SearchInput from '@/components/SearchInput';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AccueilScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showOnlyMyTops, setShowOnlyMyTops] = useState(false);
  const router = useRouter();
  const logo = require('../../../assets/images/logo.png');
  const { t } = useTranslation();

  useEffect(() => {
    Promise.all([fetchCategories(), fetchLists()])
      .then(([cats, userLists]) => {
        setCategories(cats);
        setLists(userLists);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filtrage selon le mode "Mes Tops"
  const filteredCategories = showOnlyMyTops
    ? categories.filter(cat => lists.some(list => list.category.id === cat.id))
    : categories;

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          {/* <ThemedText type="title" style={styles.title}>
            Choisissez une catégorie
          </ThemedText> */}
          <View style={styles.tabRow}>
            <Pressable
              onPress={() => setShowOnlyMyTops(false)}
              style={[
                styles.tabBtn,
                !showOnlyMyTops ? styles.tabBtnActive : styles.tabBtnInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  !showOnlyMyTops ? styles.tabBtnTextActive : styles.tabBtnTextInactive,
                ]}
              >
                {t('Toutes les catégories')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowOnlyMyTops(true)}
              style={[
                styles.tabBtn,
                showOnlyMyTops ? styles.tabBtnActive : styles.tabBtnInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  showOnlyMyTops ? styles.tabBtnTextActive : styles.tabBtnTextInactive,
                ]}
              >
                {t('Mes Tops')}
              </Text>
            </Pressable>
          </View>
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('Rechercher une catégorie')}
            style={styles.search}
          />
          <CategoryGrid
            categories={filteredCategories}
            lists={lists}
            search={search}
          />
          {filteredCategories.length === 0 && (
            <ThemedText style={{ textAlign: 'center', marginTop: 32 }}>
              {showOnlyMyTops
                ? t('Aucune catégorie remplie pour le moment.')
                : t('Aucune catégorie trouvée.')}
            </ThemedText>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
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
  search: {
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    alignSelf: 'stretch',
    marginHorizontal: 16,
    overflow: 'hidden',
    gap: 12, // Ajoute de l'espace entre les boutons (même valeur que l'espace entre colonnes)
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  tabBtnActive: {
    backgroundColor: '#3B82F6',
  },
  tabBtnInactive: {
    backgroundColor: '#E5E7EB',
  },
  tabBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#fff',
  },
  tabBtnTextInactive: {
    color: '#6B7280',
  },
});
