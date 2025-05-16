// src/services/auth.ts

import axios, { AxiosError } from 'axios';

import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginDto    { email: string; password: string }
export interface RegisterDto { email: string; username: string; password: string }

export interface AuthResponse {
  access_token: string;
  user: { id: string; email: string; username: string; avatarUrl?: string }
}

export interface MeResponse {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

const instance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor pour injecter automatiquement le token
instance.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) config.headers!['Authorization'] = `Bearer ${token}`;
    } catch (e) {
      console.error('[auth] Interceptor error:', e);
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Authentification : retourne token + user
 */
export async function login(dto: LoginDto): Promise<AuthResponse> {
  try {
    const { data } = await instance.post<AuthResponse>('/auth/login', dto);
    await AsyncStorage.setItem('token', data.access_token);
    return data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 401) throw new Error('Identifiants invalides');
    console.error('[auth] Erreur login:', error.message);
    throw new Error('Erreur réseau ou serveur lors de la connexion');
  }
}

/**
 * Inscription : appelle /auth/register, puis se logue automatiquement
 */
export async function register(dto: RegisterDto): Promise<AuthResponse> {
  try {
    // Création du compte - le backend retourne un User, pas de token
    await instance.post('/auth/register', dto);
    // Maintenant on récupère le token en se loguant
    const loginResponse = await login({ email: dto.email, password: dto.password });
    return loginResponse;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 400) {
      throw new Error('Données d’inscription invalides');
    }
    if (error.response?.status === 409) {
      throw new Error('Email ou nom d’utilisateur déjà utilisé');
    }
    console.error('[auth] Erreur register:', error.message);
    throw new Error('Erreur réseau ou serveur lors de l’inscription');
  }
}

/**
 * Déconnexion : supprime le token
 */
export async function logout(): Promise<void> {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('[auth] Erreur logout:', error);
    throw new Error('Impossible de se déconnecter');
  }
}

/**
 * Récupère l’utilisateur connecté via /users/me
 */
export async function fetchMe(): Promise<MeResponse> {
  try {
    const { data } = await instance.get<MeResponse>('/users/me');
    return data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 401) throw new Error('Non authentifié');
    console.error('[auth] Erreur fetchMe:', error.message);
    throw new Error('Impossible de récupérer votre profil');
  }
}

/**
 * Lit le token stocké
 */
export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('[auth] Erreur getToken:', error);
    throw new Error('Impossible de lire le token');
  }
}
