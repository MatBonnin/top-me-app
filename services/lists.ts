// src/services/lists.ts

import { DEVICE_LANG } from '../utils/locale';
import api from "./api";

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Item {
  id: string;
  name: string;
  rank: number;
  imageUrl?: string;
}

export interface List {
  id: string;
  title: string;
  category: Category;
  items: Item[];
  createdAt: string;
  updatedAt: string;
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}

// Lists (Top 5)
export async function fetchLists(): Promise<List[]> {
  const { data } = await api.get<List[]>('/lists');
  return data;
}

export async function fetchList(id: string): Promise<List> {
  const { data } = await api.get<List>(`/lists/${id}`);
  return data;
}

export async function createList(
  title: string,
  categoryId: string
): Promise<List> {
  const { data } = await api.post<List>('/lists', { title, categoryId });
  return data;
}

export async function updateList(
  id: string,
  title: string,
  categoryId: string
): Promise<List> {
  const { data } = await api.patch<List>(`/lists/${id}`, { title, categoryId });
  return data;
}

export async function deleteList(id: string): Promise<void> {
  await api.delete(`/lists/${id}`);
}

// Items
export async function fetchItems(listId: string): Promise<Item[]> {
  const { data } = await api.get<Item[]>(`/lists/${listId}/items`);
  return data;
}

export async function fetchListByCategory(categoryId: string): Promise<List> {
  const { data } = await api.get<List>(`/lists/category/${categoryId}`);
  return data;
}

/**
 * Ajoute un item à une liste, en envoyant également
 * la langue de saisie de l'utilisateur.
 */
export async function addItem(
  listId: string,
  name: string,
  rank: number
): Promise<Item> {
  console.log('addItem', listId, name, rank);
  const lang = DEVICE_LANG;
  const { data } = await api.post<Item>(
    `/lists/${listId}/items`,
    { name, rank, lang }
  );
  return data;
}

/**
 * Met à jour un item : si le champ `name` est présent,
 * on envoie aussi la langue actuelle pour retraduction si besoin.
 */
export async function updateItem(
  listId: string,
  itemId: string,
  fields: Partial<Pick<Item, 'name' | 'rank'>>
): Promise<Item> {
  const body: any = { ...fields };
  if (fields.name !== undefined) {
    body.lang = DEVICE_LANG;
  }
  const { data } = await api.patch<Item>(
    `/lists/${listId}/items/${itemId}`,
    body
  );
  return data;
}

export async function deleteItem(
  listId: string,
  itemId: string
): Promise<void> {
  await api.delete(`/lists/${listId}/items/${itemId}`);
}
