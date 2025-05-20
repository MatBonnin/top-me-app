// src/services/api.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour injecter automatiquement le token
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    console.log('[API] API RECUP TOKEN saved:', await AsyncStorage.getItem('token'));
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
