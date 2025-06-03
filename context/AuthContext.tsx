import {
  AuthResponse,
  facebookLogin as apiFacebookLogin,
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
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  user: AuthResponse['user'] | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithFacebook: (token: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInWithFacebook: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tentative de refresh token si fetchMe échoue
  const tryRefresh = async (): Promise<boolean> => {
    try {
      const { data } = await api.get<{ access_token: string }>('/auth/refresh');
      await AsyncStorage.setItem('token', data.access_token);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      const jwt = await AsyncStorage.getItem('token');

      if (jwt) {
        try {
          const me = await apiFetchMe();
          setUser(me);
          setLoading(false);
          return;
        } catch (err: any) {
          // si c'est un 401, on tente le refresh puis re-fetch
          if (err.response?.status === 401 && (await tryRefresh())) {
            try {
              const me2 = await apiFetchMe();
              setUser(me2);
              setLoading(false);
              return;
            } catch {
              // si refetch échoue on tombe dans la cleanup
            }
          }
          // token invalide ou refresh raté
          await AsyncStorage.removeItem('token');
        }
      }

      // pas de JWT valide, on essaye silent FB login
      const fbData = await AccessToken.getCurrentAccessToken();
      if (fbData?.accessToken) {
        try {
          const { access_token, user: me } = await apiFacebookLogin({
            accessToken: fbData.accessToken,
          });
          await AsyncStorage.setItem('token', access_token);
          setUser(me);
        } catch (fbErr) {
          console.error('Auto-FB login failed:', fbErr);
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
      LoginManager.logOut();
      await AsyncStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const { access_token, user: me } = await apiFacebookLogin({ accessToken: token });
      await AsyncStorage.setItem('token', access_token);
      setUser(me);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        signInWithFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
