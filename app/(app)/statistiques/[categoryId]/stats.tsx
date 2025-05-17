import { CategoryStat, ItemStat, fetchItemStats } from '@/services/stats'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function CategoryStatsScreen() {
  const params = useLocalSearchParams()
  const categoryId = params.categoryId as CategoryStat['id'] // récupère l'id de la catégorie
  const categoryName = params.categoryName as string | undefined // récupère le nom si passé dans les params
  const [items, setItems] = useState<ItemStat[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    if (!categoryId) return
    fetchItemStats(categoryId)
      .then(data => setItems(data.slice(0, 20)))
      .finally(() => setLoading(false))
    console.log('items', items)
  }, [categoryId])
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('Classement global')}
        {categoryName ? ` - ${categoryName}` : ''}
      </ThemedText>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 32 }}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={(
            info: ListRenderItemInfo<any> & { index?: number }
          ) => {
            const { item, index } = info
            const rank = (index ?? 0) + 1

            return (
              <View style={styles.row}>
                <Text style={styles.rank}>{rank}</Text>
                <Text style={styles.itemName}>{item.item}</Text>
                <Text style={styles.count}>{item.score}</Text>
                <Text style={styles.appearances}>({item.appearances}x)</Text>
              </View>
            )
          }}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: 'center', marginTop: 32 }}>
              {t('Aucune réponse pour cette catégorie.')}
            </ThemedText>
          }
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    marginTop: 32, // Ajoute une marge en haut
    marginBottom: 32, // Espace sous le titre
    fontSize: 28, // Plus gros titre
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 24, // Plus haut
    paddingHorizontal: 16, // Plus large
    marginBottom: 18,
    elevation: 2,
  },
  rank: {
    width: 40,
    fontWeight: 'bold',
    fontSize: 26,
    color: '#3B82F6',
    textAlign: 'center',
  },
  itemName: {
    flex: 1,
    fontSize: 22,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '600',
  },
  count: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6B7280',
    marginLeft: 12,
  },
  appearances: {
    fontSize: 18,
    color: '#9CA3AF',
    marginLeft: 12,
  },
})
