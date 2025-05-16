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
  error: string | null;
  signIn:  (email: string, password: string) => Promise<void>;
  signUp:  (email: string, username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
  error: null,
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
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const me = await apiFetchMe();
          setUser(me);
        } catch (err: any) {
          await AsyncStorage.removeItem('token');
          setUser(null);
          setError(err.message);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { access_token, user: me } = await apiLogin({ email, password });
      await AsyncStorage.setItem('token', access_token);
      setUser(me);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { access_token, user: me } = await apiRegister({ email, username, password });
      await AsyncStorage.setItem('token', access_token);
      setUser(me);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await apiLogout();
      await AsyncStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}