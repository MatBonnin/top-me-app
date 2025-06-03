// src/hooks/useThemeColor.ts
import Colors from '@/constants/Colors';
import { useThemeMode } from '@/context/ThemeContext';

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const { mode } = useThemeMode()        
  const colorFromProps = props[mode]
  return colorFromProps ?? Colors[mode][colorName]
}
