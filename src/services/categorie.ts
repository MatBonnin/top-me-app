import api from './api'
import type { Category } from '@/interfaces/services/lists'
import type { TopCategoryOfTheDay } from '@/interfaces/services/categorie'

export async function fetchTopCategoryOfTheDay(): Promise<TopCategoryOfTheDay> {
  const { data } = await api.get<TopCategoryOfTheDay>('/categories/top-of-the-day')
  console.log('fetchTopCategoryOfTheDay', data)
  return data
}