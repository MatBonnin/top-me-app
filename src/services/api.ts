// src/services/api.ts

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Intercepteur pour injecter automatiquement le token
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Intercepteur pour gérer les 401 et tenter un refresh
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalReq = error.config as AxiosRequestConfig & { _retry?: boolean };
    const isRefreshCall = originalReq.url?.endsWith('/auth/refresh');

    // Si 401, pas encore retry et ce n'est pas la route /auth/refresh, on tente un refresh
    if (
      error.response?.status === 401 &&
      !originalReq._retry &&
      !isRefreshCall
    ) {
      originalReq._retry = true;
      try {
        const { data } = await api.get<{ access_token: string }>('/auth/refresh');
        await AsyncStorage.setItem('token', data.access_token);
        if (originalReq.headers) {
          originalReq.headers.Authorization = `Bearer ${data.access_token}`;
        }
        return api(originalReq);
      } catch {
        // Le refresh a échoué, on doit forcer la déconnexion
      }
    }

    // Si on arrive ici, soit c'est un 401 sur /auth/refresh, soit retry déjà tenté
    if (error.response?.status === 401) {
      // Nettoyage du token
      await AsyncStorage.removeItem('token');
      // Redirection vers l'écran de login
      router.replace('/login');
    }

    return Promise.reject(error);
  }
);

export default api;
