import type { TextInputProps } from 'react-native';

export interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
}
