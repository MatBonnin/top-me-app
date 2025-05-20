// src/i18n.ts

import axios from 'axios';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export async function setupI18n(locale: string) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  // 1) charge depuis le backend
  const { data } = await axios.get<{ categories: Record<string,string> }>(
    API_URL+`/i18n/${locale}`
  );

  // 2) initialise i18next
  await i18n
    .use(initReactI18next)
    .init({
      lng: locale,
      resources: {
        [locale]: {
          translation: data,
        }
      },
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });

  return i18n;
}
