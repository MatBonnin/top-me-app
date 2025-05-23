// app/(tabs)/_layout.tsx

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'

export default function TabLayout() {
  const cs = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[cs ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({ ios: { position: 'absolute' }, default: {} }),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil',            tabBarIcon: ({ color }) => <IconSymbol name="house"           size={24} color={color}/> }} />
      <Tabs.Screen name="categorie" options={{ title: 'Catégories',       tabBarIcon: ({ color }) => <IconSymbol name="list"            size={24} color={color}/> }} />
      <Tabs.Screen name="statistiques" options={{ title: 'Statistiques',   tabBarIcon: ({ color }) => <IconSymbol name="list"          size={24} color={color}/> }} />
      <Tabs.Screen name="games" options={{ title: 'Games', tabBarIcon: ({ color }) => <IconSymbol name="casino"      size={24} color={color}/> }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil',            tabBarIcon: ({ color }) => <IconSymbol name="person"          size={24} color={color}/> }} />
    </Tabs>
  )
}
