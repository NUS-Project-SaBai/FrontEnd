'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { revalidatePath } from 'next/cache';

export async function patchPatient(patientId: number, formData: FormData) {
  await axiosInstance.patch(`/patients/${patientId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  revalidatePath('/records');
}
