'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Diagnosis } from '@/types/Diagnosis';

export async function patchDiagnosis(
  id: number,
  formData: FormData | object
): Promise<Diagnosis | null> {
  try {
    return await axiosInstance
      .patch(`/diagnosis/${id}/`, formData)
      .then(res => res.data);
  } catch (error) {
    console.error('Error patching diagnosis:', error);
    return null;
  }
}
