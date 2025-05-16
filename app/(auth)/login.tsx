// app/(auth)/login.tsx

import * as yup from 'yup'

import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Image, StyleSheet } from 'react-native'

import { AppButton } from '@/components/ui/AppButton'
import { TextInput } from '@/components/ui/TextInput'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { AuthContext } from '@/context/AuthContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'expo-router'

const logo = require('../../assets/images/logo.png')

interface FormData {
  email: string
  password: string
}

const schema = yup
  .object({
    email:    yup.string().email('Email invalide').required('Requis'),
    password: yup.string().min(6, 'Min 6 caractères').required('Requis'),
  })
  .required()

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) })
  const { signIn, loading, error } = useContext(AuthContext)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setBusy(true)
    try {
      await signIn(data.email, data.password)
      router.replace('/')
    } catch {}
    setBusy(false)
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
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

      {/* {error && <ThemedText type="subtitle">{error}</ThemedText>} */}

      {busy ? (
        <ActivityIndicator />
      ) : (
        <AppButton title="Se connecter" onPress={handleSubmit(onSubmit)} />
      )}

      <AppButton
        title="Pas encore de compte ? Inscription"
        variant="secondary"
        onPress={() => router.push('/register')}
        style={{ marginTop: 16 }}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 24,
    alignSelf: 'center',
  },
})
