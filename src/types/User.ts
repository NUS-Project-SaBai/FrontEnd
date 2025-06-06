export interface User {
  id: string; // or number, depending on your backend
  username: string;
  nickname?: string; // optional field
  email: string;
  role?: 'admin' | 'member'; // roles you mentioned
}
