// app/(auth)/login.tsx

import * as yup from 'yup'

import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Button, StyleSheet } from 'react-native'

import { TextInput } from '@/components/ui/TextInput'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { AuthContext } from '@/context/AuthContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'expo-router'

interface FormData {
  email:    string
  password: string
}

const schema = yup.object({
  email:    yup.string().email('Email invalide').required('Requis'),
  password: yup.string().min(6, 'Min 6 caractères').required('Requis'),
}).required()

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const { signIn } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await signIn(data.email, data.password)
      // Navigue vers la racine qui affiche l'onglet "Accueil"
      router.replace('/')
    } catch (e) {
      alert('Échec de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Connexion</ThemedText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      {loading
        ? <ActivityIndicator />
        : <Button title="Se connecter" onPress={handleSubmit(onSubmit)} />
      }

      <Button
        title="Pas encore de compte ? Inscription"
        onPress={() => router.push('/register')}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:     1,
    padding:  20,
    justifyContent: 'center',
  },
})
