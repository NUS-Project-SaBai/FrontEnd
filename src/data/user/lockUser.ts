import { axiosClientInstance } from '@/lib/axiosClientInstance';

export function lockUser(username: string) {
  return axiosClientInstance.post(`/users/${username}/lock/`);
}
