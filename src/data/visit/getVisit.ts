'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Visit } from '@/types/Visit';

export async function getVisitsByPatientId(
  patientId: string
): Promise<Visit[]> {
  return (await axiosInstance.get(`/visits?patient=${patientId}`)).data;
}

export async function getVisitById(visitId: string): Promise<Visit | null> {
  if (!visitId) return null;
  try {
    return await (
      await axiosInstance.get(`/visits/${visitId}`)
    ).data;
  } catch {
    return null;
  }
}
