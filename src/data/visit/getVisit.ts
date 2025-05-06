'use server';
import { axiosInstance } from '@/lib/axiosIntstance';
import { Visit } from '@/types/Visit';

export async function getVisitByPatientId(patientId: string): Promise<Visit[]> {
  return (await axiosInstance.get(`/visits?patient=${patientId}`)).data;
}

export async function getVisitById(visitId: string): Promise<Visit | null> {
  if (!visitId) return null;
  const visit = (await axiosInstance.get(`/visits/${visitId}`)).data;
  return visit;
}
