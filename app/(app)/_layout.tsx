// app/(app)/_layout.tsx

import { Redirect, Slot } from 'expo-router'

import { useAuth } from '@/context/AuthContext'
import React from 'react'

export default function ProtectedLayout() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user)    return <Redirect href="/login" />

  return <Slot />
}
