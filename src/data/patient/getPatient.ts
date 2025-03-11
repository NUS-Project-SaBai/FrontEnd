'use server';
import { axiosInstance } from '@/lib/axiosIntstance';
import { Patient } from '@/types/Patient';

export async function getPatient(): Promise<Patient[]> {
  const data = (await axiosInstance.get('/patients')).data;
  return data;
}

export async function getPatientById(patientId: string): Promise<Patient> {
  const data = (await axiosInstance.get(`/patients/${patientId}`)).data;
  return data;
}
