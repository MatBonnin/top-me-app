import React, { useState } from 'react'
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { useRouter } from 'expo-router'

// Liste des jeux solo (à compléter selon les jeux disponibles)
const soloGames = [
  {
    id: 'guess-top',
    name: 'Devine le Top',
    image: require('../../../assets/images/games/game-guess-top.png'), // chemin relatif
    description: 'Devine les éléments les plus populaires d\'une catégorie.',
  },
  {
    id: 'find-intruder',
    name: 'Trouve l\'intrus',
    image: require('../../../assets/images/games/game-intruder.png'), // chemin relatif
    description: 'Repère l\'élément qui ne fait pas partie du top.',
  },
  // ...ajoute d'autres jeux ici
]

export default function GamesScreen() {
  const [tab, setTab] = useState<'solo' | 'multi'>('solo')
  const router = useRouter()

  return (
    <ThemedView style={styles.container}>
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, tab === 'solo' ? styles.tabBtnActive : styles.tabBtnInactive]}
          onPress={() => setTab('solo')}
        >
          <Text style={[styles.tabBtnText, tab === 'solo' && styles.tabBtnTextActive]}>
            Jeux solo
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, tab === 'multi' ? styles.tabBtnActive : styles.tabBtnInactive, { opacity: 0.5 }]}
          // onPress={() => setTab('multi')} // désactivé pour l’instant
        >
          <Text style={[styles.tabBtnText, tab === 'multi' && styles.tabBtnTextActive]}>
            Jeux multi
          </Text>
        </Pressable>
      </View>

      {tab === 'solo' && (
        <FlatList
          data={soloGames}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => {
                if (item.id === 'guess-top') {
                  router.push('/games/guess-top/select-category')
                }
                // Ajoute d'autres jeux ici plus tard
              }}
            >
              <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </Pressable>
          )}
        />
      )}

      {tab === 'multi' && (
        <View style={styles.disabledTab}>
          <ThemedText style={{ textAlign: 'center', marginTop: 32 }}>
            Les jeux multi arrivent bientôt !
          </ThemedText>
        </View>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    alignSelf: 'stretch',
    gap: 12,
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
    color: '#6B7280',
  },
  tabBtnTextActive: {
    color: '#fff',
  },
  grid: {
    gap: 16,
    paddingBottom: 32,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    margin: 8,
    padding: 16,
    elevation: 2,
    minWidth: 140,
    maxWidth: '48%',
  },
  cardImage: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  disabledTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
