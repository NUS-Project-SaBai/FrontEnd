'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Consult } from '@/types/Consult';
import { Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';

/**
 * Fetches all the patient records including consultations and prescriptions.
 *
 * GET /api/v1/patient_records/?visit_id={visitId}
 */
export async function fetchPatientRecords(visitId: string): Promise<{
  patient: Patient;
  vitals: Vital;
  visit_date: string;
  consults: Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>[];
  prescriptions: {
    consult_id: number;
    visit_date: string;
    medication: string;
    quantity: number;
    notes: string;
    status: string;
  }[];
}> {
  return axiosInstance
    .get(`/patient_records/?visit_id=${visitId}`)
    .then(res => res.data);
  return {
    patient: {} as Patient,
    vitals: {} as Vital,
    visit_date: '2023-10-01T00:00:00Z',
    consults: [
      {
        id: 1,
        date: '2023-10-01T00:00:00Z',
        doctor: { nickname: 'Dr. Smith' },
        referred_for: 'Chronic',
      },
      {
        id: 2,
        date: '2023-10-02T00:00:00Z',
        doctor: { nickname: 'Dr. Jane' },
        referred_for: 'Acute',
      },
    ],
    prescriptions: [
      {
        consult_id: 1,
        visit_date: '2023-10-01T00:00:00Z',
        medication: 'Aspirin',
        quantity: 30,
        notes: 'Take one tablet daily',
        status: 'APPROVED',
      },
      {
        consult_id: 2,
        visit_date: '2023-10-02T00:00:00Z',
        medication: 'Ibuprofen',
        quantity: 20,
        notes: 'Take one tablet every 8 hours as needed',
        status: 'PENDING',
      },
    ],
  };
}
