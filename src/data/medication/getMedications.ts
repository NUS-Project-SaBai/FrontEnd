'use server';
import { axiosInstance } from '@/lib/axiosIntstance';
import { Medication } from '@/types/Medication';

export async function getMedication(): Promise<Medication[]> {
  const response = await axiosInstance.get('/medications');
  return response.data;
}
