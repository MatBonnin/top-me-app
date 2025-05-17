import { type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Ajout

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Utilise SafeAreaView pour gérer le padding top automatiquement
  return (
    <SafeAreaView style={[{ backgroundColor, flex: 1 }, style]} {...otherProps} />
  );
}
