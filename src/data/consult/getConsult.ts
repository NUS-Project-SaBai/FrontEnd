'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Consult, consultFromJson } from '@/types/Consult';

export async function getConsultByVisitId(
  visitId: string
): Promise<Consult[] | null> {
  if (!visitId) {
    return null;
  }
  return (await axiosInstance.get(`/consults?visit_id=${visitId}`)).data;
}

export async function getConsultByID(
  consultId: string
): Promise<Consult | null> {
  if (!consultId) return null;
  try {
    return await (
      await axiosInstance.get(`/consults/${consultId}`)
    ).data;
  } catch {
    return null;
  }
}

export async function getConsultsByPatientID(
  patientId: number
): Promise<Consult[] | null> {
  if (!patientId) {
    return null;
  }
  return (
    await axiosInstance.get(`/consults/?patient_id=${patientId}`)
  ).data.map((val: Consult) => consultFromJson(val));
}
