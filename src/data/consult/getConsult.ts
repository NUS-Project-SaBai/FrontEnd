'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Consult } from '@/types/Consult';

export async function getConsultByVisitId(
  visitId: string
): Promise<Consult[] | null> {
  if (!visitId) {
    return null;
  }
  return (await axiosInstance.get(`/consults?visit=${visitId}`)).data;
}

export async function getConsultByID(
  consultID: string
): Promise<Consult | null> {
  if (!consultID) return null;
  try {
    return await (
      await axiosInstance.get(`/consults/${consultID}`)
    ).data;
  } catch {
    return null;
  }
}
