// src/services/friendship.ts

import api from './api'
import type { Friendship } from '@/interfaces/services/friendship'

// Envoyer une demande d'ami
export async function sendFriendRequest(userId: string) {
  const { data } = await api.post<Friendship>(`/friendship/request/${userId}`)
  return data
}

// Accepter une demande d'ami
export async function acceptFriendRequest(friendshipId: string) {
  const { data } = await api.post<Friendship>(`/friendship/accept/${friendshipId}`)
  return data
}

// Rejeter une demande d'ami
export async function rejectFriendRequest(friendshipId: string) {
  const { data } = await api.post<Friendship>(`/friendship/reject/${friendshipId}`)
  return data
}

// Supprimer un ami
export async function removeFriend(friendId: string) {
  const { data } = await api.delete(`/friendship/${friendId}`)
  return data
}

// Récupérer la liste des amis
export async function fetchFriends() {
  const { data } = await api.get<Friendship[]>(`/friendship/friends`)
  return data
}

// Récupérer les demandes en attente reçues
export async function fetchPendingRequests() {
  const { data } = await api.get<Friendship[]>(`/friendship/pending`)
  return data
}

// Récupérer les demandes envoyées
export async function fetchSentRequests() {
  const { data } = await api.get<Friendship[]>(`/friendship/sent`)
  return data
}
