'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Patient } from '@/types/Patient';
import moment from 'moment';

export async function createVisit(patient: Patient) {
  await axiosInstance.post(`/visits/`, {
    patient_id: patient.pk,
    visit_date: moment().format('DD MMMM YYYY HH:mm'),
    status: 'started',
  });
}
