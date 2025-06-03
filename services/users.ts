// src/services/users.ts

import api from './api';

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface SearchUsersResult {
  users: UserSummary[];
  total: number;
}

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
