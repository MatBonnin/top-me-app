// src/services/validation.ts

import { DEVICE_LANG } from '../utils/locale';
import api from './api';

export async function batchValidate(
  category: string,
  items: { rank: number; name: string }[],
): Promise<Record<number, boolean>> {
  const { data } = await api.post<Record<number, boolean>>(
    '/validate',
    { category, items, lang: DEVICE_LANG },
  );
  return data;
}
