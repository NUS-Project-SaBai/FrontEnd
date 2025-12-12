'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Referral } from '@/types/Referral';

export async function patchReferral(
  payload: Partial<Referral>,
  id: string
): Promise<void> {
  const data = (await axiosInstance.patch(`/referrals/${id}/`, payload)).data;
  return data;
}

export async function patchReferralByConsultId(
  payload: Partial<Referral>,
  consultId: number
): Promise<void> {
  const data = (
    await axiosInstance.patch(`/referrals/?consult_id=${consultId}`, payload)
  ).data;
  return data;
}
