// // src/utils/getImageUri.ts

import { API_URL } from '@env';

/**
 * Normalise une URL d'image reçue depuis le backend :
 * - Si elle commence par '/', on la préfixe avec API_URL.
 * - Sinon on la renvoie telle quelle (URL absolue).
 */
export function getImageUri(path: string): string {
  if (!path) {
    return ''; // Retourne une chaîne vide si l'image est null ou undefined
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // on enlève slash en trop : '/static/…' => 'static/…'
  const clean = path.startsWith('/') ? path.substring(1) : path;
  return `${API_URL}/${clean}`;
}
