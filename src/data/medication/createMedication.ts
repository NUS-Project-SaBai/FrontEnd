'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Medication } from '@/types/Medication';

export async function createMedicine(
  medicine: Omit<Medication, 'id'>
): Promise<Medication> {
  return (await axiosInstance.post('/medication/', medicine)).data;
}
