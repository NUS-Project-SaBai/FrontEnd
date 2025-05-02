'use server';
import { axiosInstance } from '@/lib/axiosIntstance';
import { Consult } from '@/types/Consult';

export async function getConsultByVisitId(
  visitId: string
): Promise<Consult[] | null> {
  if (!visitId) {
    return null;
  }
  return (await axiosInstance.get(`/consults?visit=${visitId}`)).data;
}
