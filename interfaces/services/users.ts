export interface UserSummary {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface SearchUsersResult {
  users: UserSummary[];
  total: number;
}
