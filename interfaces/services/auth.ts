export interface LoginDto    { email: string; password: string }
export interface RegisterDto { email: string; username: string; password: string }
export interface FacebookLoginDto { accessToken: string }

export interface AuthResponse {
  access_token: string;
  user: { id: string; email: string; username: string; avatarUrl?: string };
}

export interface MeResponse {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
}
