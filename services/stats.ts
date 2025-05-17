import api from './api'

export interface CategoryStat {
  id: string
  categoryId?: string
  name: string
  imageUrl?: string
  count: number // nombre de listes remplies par l'utilisateur
}

export interface ItemStat {
  id: string
  categoryId: string
  item: string
  score: number
  appearances: number
  updatedAt: string
}

export async function fetchCategoryStats(): Promise<CategoryStat[]> {
  const { data } = await api.get<CategoryStat[]>('/stats/categories')
  return data
}

export async function fetchItemStats(categoryId: string): Promise<ItemStat[]> {
  console.log('fetchItemStats', categoryId)
  const { data } = await api.get<ItemStat[]>(`/stats/categories/${categoryId}/items`)
  return data
}
