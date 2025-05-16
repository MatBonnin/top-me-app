// src/context/ThemeContext.tsx

import { darkTheme, lightTheme } from '@/theme'
import React, { createContext, useContext, useState } from 'react'

import { useColorScheme } from '@/hooks/useColorScheme'
import { ThemeProvider as RNThemeProvider } from '@react-navigation/native'

type Mode = 'light' | 'dark'
const ThemeModeContext = createContext({
  mode: 'light' as Mode,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme() as Mode
  const [mode, setMode] = useState<Mode>(system)

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))

  const theme = mode === 'light' ? lightTheme : darkTheme

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <RNThemeProvider value={theme}>
        {children}
      </RNThemeProvider>
    </ThemeModeContext.Provider>
  )
}

// Hook pour y accéder facilement
export function useThemeMode() {
  return useContext(ThemeModeContext)
}
