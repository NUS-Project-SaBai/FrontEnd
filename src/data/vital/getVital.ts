'use server';

import { axiosInstance } from '@/lib/axiosIntstance';
import { Vital, vitalFromJson } from '@/types/Vital';

export async function getVitalByVisit(visitId: string): Promise<Vital | null> {
  const data = (await axiosInstance.get(`/vitals?visit=${visitId}`)).data[0];

  if (!data) return null;
  data.visit = data.visit.id;
  return vitalFromJson(data);
}
