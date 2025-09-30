'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Vital } from '@/types/Vital';

export async function getVitalByVisit(visitId: string): Promise<Vital | null> {
  if (!visitId) return null;
  let data = (await axiosInstance.get(`/vitals/?visit=${visitId}`)).data;

  if (!data || data.length == 0) return null;
  data = data[0];
  return data;
}
