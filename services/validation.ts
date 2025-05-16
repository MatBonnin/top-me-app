// src/services/validation.ts

import api from './api';

export async function batchValidate(
  category: string,
  items: string[],
): Promise<Record<string, boolean>> {
  const { data } = await api.post<Record<string, boolean>>(
    '/validate',
    { category, items },
  );
  return data;
}
