'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Referral } from '@/types/Referral';

export async function createReferral(
  formData: FormData | object
): Promise<Referral | null> {
  return await axiosInstance
    .post('/referrals/', formData)
    .then(val => val.data)
    .catch(err => {
      console.error(err);
      return null;
    });
}
