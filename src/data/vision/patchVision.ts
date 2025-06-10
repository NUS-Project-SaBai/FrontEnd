'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Vision, visionFromJson } from '@/types/Vision';

export async function patchVision(vision: Vision) {
  // remove empty fields to reduce data sent
  const jsonPayload = Object.fromEntries(
    Object.entries(vision).filter(([, v]) => v != undefined || v != '')
  );
  let data;
  try {
    data = (
      await axiosInstance.patch(`/vision?visit=${vision.visit}`, jsonPayload)
    ).data;
  } catch (e) {
    console.error(e);
    return null;
  }

  data.visit = data.visit.id;
  return visionFromJson(data);
}
