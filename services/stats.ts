import api from './api'
import type { CategoryStat, ItemStat } from '@/interfaces/services/stats'

export async function fetchCategoryStats(): Promise<CategoryStat[]> {
  const { data } = await api.get<CategoryStat[]>('/stats/categories')
  return data
}

export async function fetchItemStats(categoryId: string): Promise<ItemStat[]> {
  console.log('fetchItemStats', categoryId)
  const { data } = await api.get<ItemStat[]>(`/stats/categories/${categoryId}/items`)
  return data
}
