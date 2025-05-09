'use server';

import { axiosInstance } from '@/lib/axiosIntstance';
import { consultFromJson } from '@/types/Consult';
import { Diagnosis } from '@/types/Diagnosis';

export async function getDiagnosisByConsult(
  consult: number
): Promise<Diagnosis[]> {
  const r = (await axiosInstance.get(`/diagnosis?consult=${consult}`)).data;
  return r.map((val: Diagnosis) => ({
    ...val,
    consult: val.consult && consultFromJson(val.consult),
  }));
}
