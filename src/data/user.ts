'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import type { User } from '@/types/User';

// GET /users
export async function getUsers(): Promise<User[]> {
  const { data } = await axiosInstance.get<User[]>('/users/');
  return data;
}

// POST /users  (payload without id/role)
export async function createUser(
  payload: Omit<User, 'id' | 'role'>
): Promise<User> {
  const { data } = await axiosInstance.post<User>('/users/', payload);
  return data;
}
