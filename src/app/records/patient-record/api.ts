import { Consult } from '@/types/Consult';
import { Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';

export async function fetchPatientRecords(): Promise<{
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
