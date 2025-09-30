'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Vital, vitalFromJson } from '@/types/Vital';

export async function getVitalByVisit(visitId: string): Promise<Vital | null> {
  if (!visitId) return null;
  let data = (await axiosInstance.get(`/vitals/?visit=${visitId}`)).data;

  if (!data || data.length == 0) return null;
  data = data[0];
  return data;
}

export async function getVitalsByPatientID(
  patientID: number
): Promise<Vital[] | null> {
  if (!patientID) return null;
  return (await axiosInstance.get(`/vitals?patientID=${patientID}`)).data.map(
    vitalFromJson
  );
}
