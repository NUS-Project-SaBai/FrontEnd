'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';

export type ReferralWithDetails = {
  patient: Patient;
  referral: Referral;
  date: Date;
};

export async function getReferrals(): Promise<ReferralWithDetails[]> {
  const data = (await axiosInstance.get('/referrals/')).data;
  return data;
}

export async function getReferral(id: string): Promise<ReferralWithDetails> {
  const data = (await axiosInstance.get(`/referrals/${id}`)).data;
  return data;
}
