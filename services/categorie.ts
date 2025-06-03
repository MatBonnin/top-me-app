import api from './api'
import { Category } from './lists'

export interface TopCategoryOfTheDay {
  category: Category
  hasFilled: boolean
}

export async function fetchTopCategoryOfTheDay(): Promise<TopCategoryOfTheDay> {
  const { data } = await api.get<TopCategoryOfTheDay>('/categories/top-of-the-day')
  console.log('fetchTopCategoryOfTheDay', data)
  return data
}