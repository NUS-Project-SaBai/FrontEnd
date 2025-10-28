'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import type { User } from '@/types/User';
import { AxiosError } from 'axios';

// GET /users
export async function getUsers(): Promise<User[]> {
  const { data } = await axiosInstance.get<User[]>('/users/');
  return data;
}

// POST /users  (payload without id/role)
export async function createUser(
  payload: Omit<User, 'id' | 'role'>
): Promise<{ user: User | null; error: string | null }> {
  return axiosInstance
    .post<User>('/users/', payload)
    .then(response => {
      const { data } = response;
      return { user: data, error: null };
    })
    .catch((error: AxiosError) => {
      return {
        user: null,
        error:
          error.response == undefined
            ? error.message
            : typeof error.response?.data === 'object' &&
                error.response?.data !== null &&
                'error' in error.response.data
              ? ((error.response.data as { error?: string }).error ??
                error.message)
              : error.message,
      };
    });
}

// PATCH /users/:id  (update user)
export async function updateUser(
  userId: string,
  payload: Partial<Omit<User, 'id'>>
): Promise<{ user: User | null; error: string | null }> {
  return axiosInstance
    .patch<User>(`/users/${userId}/`, payload)
    .then(response => {
      const { data } = response;
      return { user: data, error: null };
    })
    .catch((error: AxiosError) => {
      return {
        user: null,
        error:
          error.response == undefined
            ? error.message
            : typeof error.response?.data === 'object' &&
                error.response?.data !== null &&
                'error' in error.response.data
              ? ((error.response.data as { error?: string }).error ??
                error.message)
              : error.message,
      };
    });
}
