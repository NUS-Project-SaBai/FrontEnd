'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Medication } from '@/types/Medication';

export async function getMedication(): Promise<Medication[]> {
  const response = await axiosInstance.get('/medication');
  return response.data;
}
export async function getMedicationById(id: number): Promise<Medication> {
  const response = await axiosInstance.get(`/medication/${id}`);
  return response.data;
}
