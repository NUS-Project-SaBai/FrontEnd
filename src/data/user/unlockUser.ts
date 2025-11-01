import { axiosClientInstance } from '@/lib/axiosClientInstance';

export function unlockUser(username: string) {
  return axiosClientInstance.post(`/users/${username}/unlock/`);
}
