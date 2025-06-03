import type { AuthResponse } from '@/interfaces/services/auth';

export interface AuthContextData {
  user: AuthResponse['user'] | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithFacebook: (token: string) => Promise<void>;
}
