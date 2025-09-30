'use server';
import { axiosInstance } from '@/lib/axiosInstance';

export async function getPdfConsult(consultId: number): Promise<Blob | null> {
  if (!consultId) {
    return null;
  }

  return new Blob(
    [(await axiosInstance.get(`/consults/${consultId}/pdf`)).data],
    { type: 'application/pdf' }
  );
}
