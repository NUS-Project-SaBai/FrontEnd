export interface User {
  id: number;
  username: string;
  nickname?: string; // optional field
  name?: string; // optional field
  email: string;
  role?: 'admin' | 'member'; // roles you mentioned
  is_locked: boolean;
}
