'use server';
import { axiosInstance } from '@/lib/axiosInstance';

export async function getPdfConsult(consultId: number): Promise<Blob | null> {
  if (!consultId) {
    return null;
  }

  return new Blob(
    [(await axiosInstance.get(`/pdf_consults/${consultId}`)).data],
    { type: 'application/pdf' }
  );
}
