// app/_layout.tsx
import 'react-native-reanimated'

import * as SplashScreen from 'expo-splash-screen'

import React, { useEffect } from 'react'

import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { Settings } from 'react-native-fbsdk-next'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    SplashScreen.preventAutoHideAsync()
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }

    // INITIALISATION DU SDK FACEBOOK
    if (Platform.OS === 'ios') {
      // Tracking transparency désactivé temporairement
      Settings.initializeSDK()
    } else {
      Settings.initializeSDK()
    }
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
