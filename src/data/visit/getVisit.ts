'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Visit } from '@/types/Visit';

export async function getVisitByPatientId(patientId: string): Promise<Visit[]> {
  return axiosInstance.get(`/visits/?patient=${patientId}`).then(res => {
    return res.data;
  });
}

export async function getVisitById(visitId: string): Promise<Visit | null> {
  if (!visitId) return null;
  try {
    return (await axiosInstance.get(`/visits/${visitId}/`)).data;
  } catch {
    return null;
  }
}
