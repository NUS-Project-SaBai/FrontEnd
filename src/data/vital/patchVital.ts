'use server';

import { axiosInstance } from '@/lib/axiosIntstance';
import { Vital, vitalFromJson } from '@/types/Vital';

export async function patchVital(vital: Vital) {
  // remove empty fields to reduce data sent
  const jsonPayload = Object.fromEntries(
    Object.entries(vital).filter(([, v]) => v != undefined)
  );
  const data = (
    await axiosInstance.patch(`/vitals?visit=${vital.visit}`, jsonPayload)
  ).data;

  data.visit = data.visit.id;
  return vitalFromJson(data);
}
