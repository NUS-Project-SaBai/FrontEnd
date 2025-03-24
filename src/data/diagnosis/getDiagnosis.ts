'use server';

import { axiosInstance } from '@/lib/axiosIntstance';
import { Diagnosis } from '@/types/Diagnosis';

export async function getDiagnosisByConsult(
  consult: number
): Promise<Diagnosis[]> {
  return (await axiosInstance.get(`/diagnosis?consult=${consult}`)).data;
}
