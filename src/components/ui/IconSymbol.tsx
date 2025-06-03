import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name']; // Restrict to allowed Material Icons names
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={name} style={style} />;
}