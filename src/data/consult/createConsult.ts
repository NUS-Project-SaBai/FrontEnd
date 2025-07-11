'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Consult, consultFromJson } from '@/types/Consult';

export async function createConsult(
  formData: FormData | object
): Promise<Consult | null> {
  return await axiosInstance
    .post('/consults/', formData)
    .then(val => consultFromJson(val.data))
    .catch(err => {
      console.error(err);
      return null;
    });
}
