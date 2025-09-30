import { axiosInstance } from '@/lib/axiosInstance';
import { Consult } from '@/types/Consult';
import { Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';

/**
 * Fetches all the patient for a visit.
 *
 * GET /api/v1/patient_consult/?visit_id={visitId}
 */
export async function fetchPatientConsultationInfo(visitId: number): Promise<{
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
    .get(`/patient_consult/?visit_id=${visitId}`)
    .then(res => res.data);
}
