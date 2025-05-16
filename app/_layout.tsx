// app/_layout.tsx
import 'react-native-reanimated'

import * as SplashScreen from 'expo-splash-screen'

import React, { useEffect } from 'react'

import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <ThemeProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
