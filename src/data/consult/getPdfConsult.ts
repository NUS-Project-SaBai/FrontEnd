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

export async function getLatestPdfConsult(
  patientId: number
): Promise<Blob |  null> {
  if (!patientId) {
    throw new Error('Invalid patient ID:' + patientId);
  }
  return axiosInstance
    .get(`/patients/${patientId}/reports/pdf/latest_consult/`)
    .then(r => {
      return new Blob([r.data], { type: 'application/pdf' });
    })
    .catch(err => {
      throw new Error(err.response.data.error);
    });
}

export async function getAllPdfConsults(
  patientId: number
): Promise<Blob | null> {
  if (!patientId) {
    throw new Error('Invalid patient ID:' + patientId);
  }
  return axiosInstance
    .get(`/patients/${patientId}/reports/pdf/all_consults/`)
    .then(r => {
      return new Blob([r.data], { type: 'application/pdf' })
    })
    .catch(err => {
      throw new Error(err.response.data.error);
    });
}