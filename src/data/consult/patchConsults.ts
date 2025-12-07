'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Consult } from '@/types/Consult';

export async function patchConsults(
  id: number,
  formData: FormData | object
): Promise<Consult | null> {
  try {
    return await axiosInstance
      .patch(`/consults/${id}/`, formData)
      .then(res => res.data);
  } catch (error) {
    console.error('Error patching consult:', error);
    return null;
  }
}
