import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'

import CategoryCard from '@/components/CategoryCard'
import { ThemedView } from '@/components/ui/ThemedView'
import { fetchTopCategoryOfTheDay } from '@/services/categorie'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function AccueilScreen() {
  const [categoryOfTheDay, setCategoryOfTheDay] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const logo = require('../../../assets/images/logo.png')
  const router = useRouter()

  useEffect(() => {
    fetchTopCategoryOfTheDay()
      .then(data => setCategoryOfTheDay(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <ThemedView style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
        ) : categoryOfTheDay ? (
          <View style={styles.categoryBox}>
            <Text style={styles.title}>{t('Catégorie du jour')}</Text>
            <View style={styles.cardWrapper}>
              <CategoryCard
                name={categoryOfTheDay.category.name}
                imageUrl={categoryOfTheDay.category.imageUrl}
                width={200}
                minHeight={140}
                iconSize={80}
                fontSize={18}
                hasList={categoryOfTheDay.hasFilled}
                onPress={() =>
                  router.push({
                    pathname: '/(list)/[categoryId]',
                    params: {
                      categoryId: categoryOfTheDay.category.id,
                      categoryName: categoryOfTheDay.category.name,
                      categoryImage: categoryOfTheDay.category.imageUrl,
                    },
                  })
                }
              />
            </View>
          </View>
        ) : (
          <Text style={styles.noCategory}>{t('Aucune catégorie du jour disponible.')}</Text>
        )}
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 0,
   
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loader: {
    marginTop: 32,
  },
  categoryBox: {
 
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',

    // Suppression de l'ombre et du border
  },
  cardWrapper: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3B82F6',
  },
  noCategory: {
    marginTop: 32,
    color: '#6B7280',
    fontSize: 16,
  },
})