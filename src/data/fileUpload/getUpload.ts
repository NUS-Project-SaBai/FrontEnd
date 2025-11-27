'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Upload } from '@/types/Upload';

export async function getUploadByPatientId(patient_pk: number): Promise<Upload> {
  return (await axiosInstance.get(`/files/?patient_pk=${patient_pk}`)).data[0];
}
