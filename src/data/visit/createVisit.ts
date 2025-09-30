'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Patient } from '@/types/Patient';
import { formatDate } from '@/utils/formatDate';

export async function createVisit(patient: Patient) {
  await axiosInstance.post(`/visits/`, {
    patient_id: patient.pk,
    visit_date: formatDate(),
    status: 'started',
  });
}
