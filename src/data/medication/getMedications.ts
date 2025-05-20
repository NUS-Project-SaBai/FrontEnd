'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Medication } from '@/types/Medication';

export async function getMedication(): Promise<Medication[]> {
  const response = await axiosInstance.get('/medications');
  return response.data;
}
