import { CategoryStat, fetchCategoryStats } from '@/services/stats'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import CategoryGrid from '@/components/CategoryGrid'
import SearchInput from '@/components/SearchInput'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function GuessTopSelectCategoryScreen() {
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchCategoryStats()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  const handleRandom = () => {
    if (filtered.length === 0) return
    const idx = Math.floor(Math.random() * filtered.length)
    const cat = filtered[idx]
    router.push({
      pathname: '/games/guess-top/play',
      params: { categoryId: cat.categoryId || cat.id, categoryName: cat.name }
    })
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Choisis une catégorie</ThemedText>
      <View style={styles.row}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher une catégorie"
          style={{ flex: 1 }}
        />
        <Pressable style={styles.randomBtn} onPress={handleRandom}>
          <Ionicons name="shuffle" size={24} color="#3B82F6" />
          <ThemedText style={styles.randomBtnText}>Aléatoire</ThemedText>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        <CategoryGrid
          categories={filtered}
          lists={[]}
          search={''}
          onCategoryPress={cat =>
            router.push({
              pathname: '/games/guess-top/play',
              params: { categoryId: cat.id, categoryName: cat.name }
            })
          }
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 16, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  randomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  randomBtnText: {
    marginLeft: 6,
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
})
