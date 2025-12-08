'use server';

import { axiosInstance } from '@/lib/axiosInstance';

export async function deleteDiagnosis(id: number): Promise<boolean> {
  try {
    await axiosInstance.delete(`/diagnosis/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting diagnosis:', error);
    return false;
  }
}
