'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Diagnosis } from '@/types/Diagnosis';

export async function createDiagnosis(
  formData: FormData | object
): Promise<Diagnosis | null> {
  try {
    return await axiosInstance
      .post('/diagnosis/', formData)
      .then(res => res.data);
  } catch (error) {
    console.error('Error creating diagnosis:', error);
    return null;
  }
}
