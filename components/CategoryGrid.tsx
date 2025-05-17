import { Category, List } from '@/services/lists'
import { StyleSheet, View } from 'react-native'

import CategoryCard from './CategoryCard'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

interface Props {
  categories: Category[]
  lists: List[]
  search?: string
}

export default function CategoryGrid({ categories, lists, search = '' }: Props) {
  const router = useRouter()
  const { t } = useTranslation()

  const filtered = categories.filter(cat =>
    t(`categories.${cat.name}`)
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  )

  return (
    <View style={styles.grid}>
      {filtered.map(cat => {
        const hasList = lists.some(list => list.category.id === cat.id)
        return (
          <CategoryCard
            key={cat.id}
            name={t(`categories.${cat.name}`)}
            imageUrl={cat.imageUrl!}
            hasList={hasList}
            onPress={() => {
              router.push({
                pathname: '/[categoryId]',
                params: {
                  categoryId: cat.id,
                  categoryName: cat.name,
                  categoryImage: cat.imageUrl,
                },
              })
            }}
          />
        )
      })}
      {filtered.length % 2 === 1 && <View style={{ width: '48%' }} />}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
})
