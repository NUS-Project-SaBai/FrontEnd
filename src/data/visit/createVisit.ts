'use server';
import { axiosInstance } from '@/lib/axiosIntstance';
import { Patient } from '@/types/Patient';
import moment from 'moment';

export async function createVisit(patient: Patient) {
  axiosInstance.post(`/visits?patient=${patient.pk}`, {
    patient: patient.pk,
    visit_date: moment().format('DD MMMM YYYY HH:mm'),
    status: 'started',
  });
}
