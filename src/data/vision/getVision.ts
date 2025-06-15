'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Vision, visionFromJson } from '@/types/Vision';

export async function getVisionByVisit(
  visitId: string
): Promise<Vision | null> {
  if (!visitId) return null;
  const response = await axiosInstance.get(`/glasses?visit=${visitId}`);
  const data = response.data;
  return visionFromJson(data);
}
