'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Diagnosis } from '@/types/Diagnosis';

export async function getDiagnosisByConsult(
  consult: number
): Promise<Diagnosis[]> {
  return (await axiosInstance.get(`/diagnosis/?consult=${consult}`)).data;
}
