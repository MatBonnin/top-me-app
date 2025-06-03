import type { ViewStyle } from 'react-native';

export type Variant = 'info' | 'success' | 'warning' | 'error';

export interface SnackbarProps {
  message: string;
  variant?: Variant;
  duration?: number;
  onDismiss?: () => void;
  style?: ViewStyle;
}
