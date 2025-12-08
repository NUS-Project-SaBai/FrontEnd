'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Consult } from '@/types/Consult';
import { AxiosError } from 'axios';

export async function patchConsults(
  id: number,
  formData: FormData | object
): Promise<Consult | null> {
  try {
    return await axiosInstance
      .patch(`/consults/${id}/`, formData)
      .then(res => res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error?.response?.data;
    } else {
      console.error('Unexpected error:', error);
      return null;
    }
  }
}
