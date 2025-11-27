'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Upload } from '@/types/Upload';

export async function getUploadByPatientId(
  patient_pk: number
): Promise<Upload | null> {
  const response = await axiosInstance.get(`/files/?patient_pk=${patient_pk}`);
  const uploads = response.data;
  if (!Array.isArray(uploads) || uploads.length === 0) {
    return null;
  }
  return uploads[0];
}
