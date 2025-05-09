'use server';
import { axiosInstance } from '@/lib/axiosIntstance';
import { Medication } from '@/types/Medication';

export async function createMedicine(
  medicine: Omit<Medication, 'id'>
): Promise<Medication> {
  return (await axiosInstance.post('/medications', medicine)).data;
}
