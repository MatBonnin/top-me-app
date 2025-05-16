// app/(app)/(tabs)/[categoryId]/index.tsx

import {
  addItem,
  createList,
  deleteItem,
  fetchListByCategory,
  updateItem,
  updateList,
} from '@/services/lists'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { AppButton } from '@/components/ui/AppButton'
import { ListInput } from '@/components/ui/ListInput'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'

export default function CreateTop5Screen() {
  const { categoryId, categoryName } =
    useLocalSearchParams<{ categoryId: string; categoryName: string }>()
    console.log(categoryId, categoryName)
  const router = useRouter()

  const [listId, setListId] = useState<string | null>(null)
  const [title, setTitle]   = useState(`Top 5 ${categoryName}`)
  const [items, setItems] = useState<{ id?: string; name: string }[]>(
    Array.from({ length: 5 }, () => ({ name: '' }))
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // reset
      setListId(null)
      setItems(Array.from({ length: 5 }, () => ({ name: '' })))
      setTitle(`Top 5 ${categoryName}`)

      try {
        const list = await fetchListByCategory(categoryId)
        setListId(list.id)
  
        const filled = Array.from({ length: 5 }, () => ({ name: '' })) as Array<
          { id?: string; name: string }
        >
        list.items.forEach((it, idx) => {
          if (idx < 5) filled[idx] = { id: it.id, name: it.name }
        })
        setItems(filled)
      } catch {
        // pas de liste existante → on reste initialisé
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [categoryId, categoryName])

  const onSave = async () => {
    setSaving(true)
    try {
      let list
      if (listId) {
        list = await updateList(listId, title, categoryId)
      } else {
        list = await createList(title, categoryId)
        setListId(list.id)
      }

      for (let i = 0; i < 5; i++) {
        const it = items[i]
        if (it.id) {
          if (it.name.trim()) {
            await updateItem(list.id, it.id, { name: it.name, rank: i + 1 })
          } else {
            await deleteItem(list.id, it.id)
          }
        } else if (it.name.trim()) {
          await addItem(list.id, it.name, i + 1)
        }
      }

      router.replace('/')
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Échec de l’enregistrement.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Chargement…</ThemedText>
      </ThemedView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>

        {items.map((it, idx) => (
          <View key={idx} style={styles.row}>
            <ThemedText type="bigSubtitle" style={styles.rank}>
              {idx + 1}
            </ThemedText>
            <ListInput
              placeholder={`${categoryName} ${idx + 1}`}
              value={it.name}
              onChangeText={(text) => {
                const copy = [...items]
                copy[idx].name = text
                setItems(copy)
              }}
            />
          </View>
        ))}

        <AppButton
          title={saving ? 'Enregistrement…' : 'Enregistrer'}
          onPress={onSave}
          disabled={saving}
        />
        <AppButton
          title="Annuler"
          variant="secondary"
          onPress={() => router.back()}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20 ,marginTop: 100},
  row: { flexDirection: 'row', marginBottom: 12 },
  rank: { width: 24, textAlign: 'right', marginRight: 8,paddingTop: 8 },
  title: { marginBottom: 48 },
})
