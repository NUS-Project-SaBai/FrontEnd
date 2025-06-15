'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Referral } from '@/types/Referral';

export async function patchReferral(
  payload: Partial<Referral>,
  id: string
): Promise<void> {
  const data = (await axiosInstance.patch(`/referrals/${id}`, payload)).data;
  return data;
}
