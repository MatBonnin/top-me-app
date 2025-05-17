import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/ui/AppButton'
import { ListInput } from '@/components/ui/ListInput'
import { Snackbar } from '@/components/ui/Snackbar'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { fetchItemStats } from '@/services/stats'

export default function GuessTopPlayScreen() {
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId: string, categoryName: string }>()
  const [top, setTop] = useState<(string | null)[]>([null, null, null, null, null])
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const [maxTries] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const inputRef = useRef<any>(null)

  // On charge le vrai top 5 (pour la vérification)
  useEffect(() => {
    if (!categoryId) return
    setLoading(true)
    fetchItemStats(categoryId as string)
      .then(items => setAnswers(items.slice(0, 5).map(i => i.item)))
      .finally(() => setLoading(false))
  }, [categoryId])

  const handleTry = () => {
    if (!input.trim() || success || tries >= maxTries) return
    const guess = input.trim()
    const idx = answers.findIndex(
      (ans, i) => ans.toLowerCase() === guess.toLowerCase() && !top[i]
    )
    if (idx !== -1) {
      // Bonne réponse, place le mot à la bonne place
      const newTop = [...top]
      newTop[idx] = answers[idx]
      setTop(newTop)
      setInput('')
      setError(null)
      if (newTop.every(Boolean)) setSuccess(true)
    } else {
      setError('Mauvaise réponse !')
      setInput('')
    }
    setTries(t => t + 1)
  }

  const handleInputSubmit = () => {
    if (input.trim()) handleTry()
  }

  const handleRestart = () => {
    setTop([null, null, null, null, null])
    setInput('')
    setTries(0)
    setError(null)
    setSuccess(false)
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Devine le Top 5 {categoryName ? `- ${categoryName}` : ''}
      </ThemedText>
      <View style={styles.inputContainerTop}>
        <ListInput
          value={input}
          onChangeText={setInput}
          placeholder="Propose un élément du top"
          onSubmitEditing={handleInputSubmit}
          editable={!success && tries < maxTries}
          style={styles.input}
        />
        <AppButton
          title="Valider"
          onPress={handleTry}
          disabled={!input.trim() || success || tries >= maxTries}
          style={{ marginLeft: 8 }}
        />
      </View>
      <View style={styles.topList}>
        {[0, 1, 2, 3, 4].map(i => (
          <View key={i} style={styles.row}>
            <ThemedText type="bigSubtitle" style={styles.rank}>{i + 1}</ThemedText>
            <ThemedText style={styles.itemText}>
              {top[i] ? top[i] : '______'}
            </ThemedText>
          </View>
        ))}
      </View>
      <ThemedText style={styles.tries}>
        Essais : {tries} / {maxTries}
      </ThemedText>
      {success && (
        <Snackbar
          message="Bravo, tu as trouvé tout le top !"
          variant="success"
          onDismiss={() => setSuccess(false)}
        />
      )}
      {error && (
        <Snackbar
          message={error}
          variant="error"
          onDismiss={() => setError(null)}
        />
      )}
      {(success || tries >= maxTries) && (
        <AppButton
          title="Rejouer"
          onPress={handleRestart}
          style={{ marginTop: 24 }}
        />
      )}
      {tries >= maxTries && !success && (
        <ThemedText style={styles.failMsg}>
          Perdu ! Le top était : {answers.join(', ')}
        </ThemedText>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 16, textAlign: 'center' },
  inputContainerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  topList: { marginTop: 24, marginBottom: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
    elevation: 2,
  },
  rank: {
    width: 40,
    textAlign: 'right',
    marginRight: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#888',
  },
  itemText: {
    fontSize: 22,
    color: '#374151',
    fontWeight: '600',
  },
  inputContainer: {
    display: 'none',
  },
  input: {
    flex: 1,
    fontSize: 18,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tries: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 8,
  },
  failMsg: {
    textAlign: 'center',
    color: '#EF4444',
    marginTop: 16,
    fontWeight: 'bold',
  },
})
