// hooks/useThemeColor.ts

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  return colorFromProps ?? Colors[theme][colorName];
}