// app/(app)/(tabs)/mes-tops.tsx

import { CategoryStat, fetchCategoryStats } from '@/services/stats'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { getImageUri } from '@/utils/getImageUri'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function StatsScreen() {
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    fetchCategoryStats()
      .then(data => setCategories(data.sort((a, b) => b.count - a.count)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('Statistiques globales')}
      </ThemedText>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 32 }}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={cat => cat.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.categoryRow}
              onPress={() =>
                router.push({
                  // on indique la route « à trous » correspondant à ton fichier
                  pathname: '/statistiques/[categoryId]/stats',
                  params: {
                    categoryId: String(item.categoryId),
                    categoryName: t(
                      `categories.${item.name}`,
                      { defaultValue: item.name }
                    ),
                  },
                })
              }
            >
              <Image
                source={{ uri: getImageUri(item.imageUrl || '') }}
                style={styles.icon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryName}>
                  {t(`categories.${item.name}`, { defaultValue: item.name })}
                </Text>
                <Text style={styles.count}>
                  {item.count} {t('tops remplis')}
                </Text>
              </View>
              {'listCount' in item && typeof item.listCount === 'number' && (
                <View style={styles.completedCountBox}>
                  <Text style={styles.completedCountText}>
                    {item.listCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: 'center', marginTop: 32 }}>
              {t('Aucune statistique disponible.')}
            </ThemedText>
          }
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 24 },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#F3F4F6',
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
  },
  count: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  completedCountBox: {
    minWidth: 36,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  completedCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
})
