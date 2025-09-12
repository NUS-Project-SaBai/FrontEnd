'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Vital } from '@/types/Vital';

export async function patchVital(vital: Vital) {
  // remove empty fields to reduce data sent
  const jsonPayload = Object.fromEntries(
    Object.entries(vital).filter(([, v]) => v != undefined || v != '')
  );
  try {
    return (
      await axiosInstance.patch(`/vitals/?visit=${vital.visit_id}`, jsonPayload)
    ).data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
