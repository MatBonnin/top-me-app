// src/utils/locale.ts

import * as Localization from 'expo-localization';

/**
 * Code de langue de l'appareil : 'fr', 'en', 'es', ...
 * On split sur '-' pour enlever les régions (ex. 'fr-FR' → 'fr')
 */
export const DEVICE_LANG = (() => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    return locales[0].languageCode;
  }
  return 'en';
})();

/**
 * Hook React permettant de récupérer le language en composant
 */
export function useDeviceLang(): string {
  return DEVICE_LANG!;
}
