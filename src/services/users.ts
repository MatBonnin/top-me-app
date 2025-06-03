// src/services/users.ts

import api from './api';
import type { SearchUsersResult, UserSummary } from '@/interfaces/services/users';

/**
 * Recherche d'utilisateurs (pagination simple).
 */
export async function searchUsers(
  q: string,
  page = 1,
  limit = 20
): Promise<SearchUsersResult> {
  const { data } = await api.get<SearchUsersResult>('/users/search', {
    params: { q, page, limit },
  });
  return data;
}

/**
 * Envoie une demande d'amitié à l'utilisateur cible.
 */
export async function sendFriendRequest(userId: string): Promise<void> {
  await api.post(`/friendship/request/${userId}`);
}
