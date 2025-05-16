// theme/index.ts

import {
  DarkTheme as RNDark,
  DefaultTheme as RNDefault,
  Theme,
} from '@react-navigation/native';

import Colors from '@/constants/Colors';

export const lightTheme: Theme = {
  ...RNDefault,
  colors: {
    ...RNDefault.colors,
    primary:      Colors.light.primary,
    background:   Colors.light.background,
    card:         Colors.light.card,
    text:         Colors.light.textPrimary,
    border:       Colors.light.border,
    notification: Colors.light.notification,
  },
};

export const darkTheme: Theme = {
  ...RNDark,
  colors: {
    ...RNDark.colors,
    primary:      Colors.dark.primary,
    background:   Colors.dark.background,
    card:         Colors.dark.card,
    text:         Colors.dark.textPrimary,
    border:       Colors.dark.border,
    notification: Colors.dark.notification,
  },
};