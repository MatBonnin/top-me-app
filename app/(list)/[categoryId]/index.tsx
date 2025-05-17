// app/(app)/(tabs)/[categoryId]/index.tsx

import {
  addItem,
  createList,
  deleteItem,
  fetchListByCategory,
  updateItem,
  updateList,
} from '@/services/lists'
import { batchValidate } from '@/services/validation'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { AppButton } from '@/components/ui/AppButton'
import { ListInput } from '@/components/ui/ListInput'
import { Snackbar } from '@/components/ui/Snackbar'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import Colors from '@/constants/Colors'
import { useThemeMode } from '@/context/ThemeContext'
import { getImageUri } from '@/utils/getImageUri'
import { useTranslation } from 'react-i18next'

export default function CreateTop5Screen() {
  const { t } = useTranslation()
  const { mode } = useThemeMode()
  const router = useRouter()
  const { categoryId, categoryName, categoryImage } =
    useLocalSearchParams<{
      categoryId: string
      categoryName: string
      categoryImage: string
    }>()

  const [listId, setListId] = useState<string | null>(null)
  const [title, setTitle] = useState(`Top 5 ${t(`categories.${categoryName}`)}`)
  const [items, setItems] = useState<{ id?: string; name: string }[]>(
    Array.from({ length: 5 }, () => ({ name: '' }))
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const validationCache = useRef<Record<string, boolean>>({})
  const [invalidItems, setInvalidItems] = useState<Record<number, boolean>>({})
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null)
  const [snackbar, setSnackbar] = useState<{
    message: string
    variant: 'info' | 'success' | 'warning' | 'error'
  } | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setListId(null)
      setItems(Array.from({ length: 5 }, () => ({ name: '' })))
      setTitle(`Top 5 ${t(`categories.${categoryName}`)} `)

      try {
        const list = await fetchListByCategory(categoryId)
        setListId(list.id)

        const filled = Array.from({ length: 5 }, () => ({ name: '' })) as Array<{
          id?: string
          name: string
        }>
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

    // Préparer les données à valider avec le rank
    const itemsToValidate = items
      .map((it, idx) => ({
        rank: idx + 1,
        name: it.name.trim(),
      }))
      .filter(it => it.name)

    // Appeler batchValidate avec [{rank, name}, ...]
    const result = await batchValidate(categoryName!, itemsToValidate)
    console.log('Validation result:', result)
    console.log('itemsToValidate:', itemsToValidate)

    // Adapter la détection des champs invalides
    const invalid: Record<number, boolean> = {}
    itemsToValidate.forEach(it => {
      if (!result[it.rank]) invalid[it.rank - 1] = true
      validationCache.current[`${categoryName}:${it.name}`.toLowerCase()] =
        result[it.rank]
    })
    setInvalidItems(invalid)

    if (Object.keys(invalid).length > 0) {
      setSnackbar({
        message:
          t('validation.invalid_items', {
            defaultValue: 'Champs invalides:',
          }) +
          ' ' +
          Object.keys(invalid)
            .map(i => `${Number(i) + 1}`)
            .join(', '),
        variant: 'warning',
      })
      setSaving(false)
      return
    }

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
            await updateItem(list.id, it.id, {
              name: it.name,
              rank: i + 1,
            })
          } else {
            await deleteItem(list.id, it.id)
          }
        } else if (it.name.trim()) {
          await addItem(list.id, it.name, i + 1)
        }
      }

      setSnackbar({
        message: t('common.saved', { defaultValue: 'Enregistré !' }),
        variant: 'success',
      })
      router.replace('/')
    } catch (err: any) {
      setSnackbar({
        message:
          err.message || t('common.save_error', { defaultValue: 'Échec de l’enregistrement.' }),
        variant: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>{t('common.loading', { defaultValue: 'Chargement…' })}</ThemedText>
      </ThemedView>
    )
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {categoryImage && (
            <Image
              source={{ uri: getImageUri(categoryImage) }}
              style={styles.categoryImage}
            />
          )}
          <ThemedText type="title" style={styles.title}>
            { 'Top 5 ' + t(`categories.${categoryName}`, {
              defaultValue: categoryName,
            })}
          </ThemedText>

          {items.map((it, idx) => (
            <View key={idx} style={styles.row}>
              <View
                style={[
                  styles.itemContainer,
                  mode === 'dark'
                    ? styles.itemContainerDark
                    : styles.itemContainerLight,
                  invalidItems[idx] && { borderColor: '#EF4444' },
                  focusedIdx === idx && { borderColor: Colors[mode].primary },
                ]}
              >
                <ThemedText
                  type="bigSubtitle"
                  style={[
                    styles.rank,
                    invalidItems[idx] && { color: '#EF4444' },
                  ]}
                >
                  {idx + 1}
                </ThemedText>
                <ListInput
                  placeholder={`${t(
                    `categories.${categoryName}`,
                    { defaultValue: categoryName }
                  )} ${idx + 1}`}
                  value={
                    it.name
                      ? t(`items.${it.name}`, { defaultValue: it.name })
                      : ''
                  }
                  onChangeText={text => {
                    const copy = [...items]
                    copy[idx].name = text
                    setItems(copy)
                    setInvalidItems(prev => ({ ...prev, [idx]: false }))
                  }}
                  style={[styles.inputNoBg]}
                  onFocus={() => setFocusedIdx(idx)}
                  onBlur={() =>
                    setFocusedIdx(focusedIdx === idx ? null : focusedIdx)
                  }
                />
              </View>
            </View>
          ))}

          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.bottomButtons}>
          <AppButton
            title={saving ? t('common.saving', { defaultValue: 'Enregistrement…' }) : t('common.save', { defaultValue: 'Enregistrer' })}
            onPress={onSave}
            disabled={saving}
            style={{ flex: 1, marginRight: 8 }}
          />
          <AppButton
            title={t('common.cancel', { defaultValue: 'Annuler' })}
            variant="secondary"
            onPress={() => router.back()}
            style={{ flex: 1, marginLeft: 8, marginTop: 0 }}
          />
        </View>
      </KeyboardAvoidingView>

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          variant={snackbar.variant}
          onDismiss={() => setSnackbar(null)}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    padding: 20,
    marginTop: 40,
    paddingBottom: 140,
    minHeight: 600,
  },
  categoryImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    borderRadius: 60,
  },
  title: {
    marginVertical: 24,
    textAlign: 'center',
  },
  row: {
    marginBottom: 28,
    alignItems: 'center',
    minHeight: 72,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingLeft: 18,
    paddingRight: 12,
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  itemContainerLight: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  itemContainerDark: {
    backgroundColor: '#18181b',
    borderColor: '#27272a',
  },
  rank: {
    width: 40,
    textAlign: 'right',
    marginRight: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#888',
  },
  inputNoBg: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    flex: 1,
    fontSize: 22,
    height: 64,
    paddingHorizontal: 0,
  },
  bottomButtons: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
})
