// src/context/AuthContext.tsx

import {
  AuthResponse,
  fetchMe as apiFetchMe,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from '@/services/auth';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  user: AuthResponse['user'] | null;
  loading: boolean;
  signIn:  (email: string, password: string) => Promise<void>;
  signUp:  (email: string, username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Export du contexte pour l'usage direct si nécessaire
export const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
  signIn:  async () => {},
  signUp:  async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage, on recharge le token + l'utilisateur
  useEffect(() => {
    async function loadUser() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const me = await apiFetchMe();
          setUser(me);
        } catch {
          // token invalide ou expiré
          await AsyncStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  // Connexion
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { access_token, user: me } = await apiLogin({ email, password });
    await AsyncStorage.setItem('token', access_token);
    setUser(me);
    setLoading(false);
  };

  // Inscription
  const signUp = async (email: string, username: string, password: string) => {
    setLoading(true);
    const { access_token, user: me } = await apiRegister({ email, username, password });
    await AsyncStorage.setItem('token', access_token);
    setUser(me);
    setLoading(false);
  };

  // Déconnexion
  const signOut = async () => {
    await apiLogout();
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}