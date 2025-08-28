'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Consult } from '@/types/Consult';

export async function createConsult(
  formData: FormData | object
): Promise<Consult | null> {
  return await axiosInstance
    .post('/consults/', formData)
    .then(r => r.data)
    .catch(err => {
      console.error(err);
      return null;
    });
}
