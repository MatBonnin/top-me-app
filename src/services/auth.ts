// src/services/auth.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import api from './api';
import type {
  AuthResponse,
  FacebookLoginDto,
  LoginDto,
  MeResponse,
  RegisterDto,
} from '@/interfaces/services/auth';

/**
 * Authentification : retourne token + user
 */
export async function login(dto: LoginDto): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    await AsyncStorage.setItem('token', data.access_token);
    return data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 401) throw new Error('Identifiants invalides');
    throw new Error('Erreur réseau ou serveur lors de la connexion');
  }
}

/**
 * Inscription : crée le compte puis récupère le token automatiquement
 */
export async function register(dto: RegisterDto): Promise<AuthResponse> {
  try {
    await api.post('/auth/register', dto);
    return login({ email: dto.email, password: dto.password });
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 400) throw new Error('Données d’inscription invalides');
    if (error.response?.status === 409) throw new Error('Email ou nom d’utilisateur déjà utilisé');
    throw new Error('Erreur réseau ou serveur lors de l’inscription');
  }
}

/**
 * Connexion via Facebook : retourne token + user
 */
export async function facebookLogin(dto: FacebookLoginDto): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/facebook', { accessToken: dto.accessToken });
    await AsyncStorage.setItem('token', data.access_token);
    return data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 401) throw new Error('Token Facebook invalide');
    throw new Error('Erreur réseau ou serveur lors de la connexion Facebook');
  }
}

/**
 * Déconnexion : supprime le token
 */
export async function logout(): Promise<void> {
  await AsyncStorage.removeItem('token');
}

/**
 * Récupère l’utilisateur connecté via /users/me
 */
export async function fetchMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>('/users/me');
  return data;
}

/**
 * Lit le token stocké
 */
export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('token');
}
