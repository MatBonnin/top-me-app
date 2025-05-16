// app/(auth)/register.tsx

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
  username: string
  password: string
}

const schema = yup.object({
  email:    yup.string().email('Email invalide').required('Requis'),
  username: yup.string().min(3, 'Min 3 caractères').required('Requis'),
  password: yup.string().min(6, 'Min 6 caractères').required('Requis'),
}).required()

export default function RegisterScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const { signUp } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await signUp(data.email, data.username, data.password)
      // Une fois inscrit, on retourne à l'accueil
      router.replace('/')
    } catch {
      alert('Échec de l’inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Inscription</ThemedText>

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
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Nom d’utilisateur"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.username?.message}
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
        : <Button title="S’inscrire" onPress={handleSubmit(onSubmit)} />
      }

      <Button
        title="Déjà un compte ? Connexion"
        onPress={() => router.push('/login')}
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
