import api from './api'
import { Category } from './lists'

export async function fetchTopCategoryOfTheDay(): Promise<Category> {
  const { data } = await api.get<Category>('/categories/top-of-the-day') 
  console.log('fetchTopCategoryOfTheDay', data)
  return data
}