'use server';
/**
 * For HistoryMedicationModal, all medication_review
 *
 * GET /api/v1/medication_history/?medicine_id={id}
 */

import { axiosInstance } from '@/lib/axiosInstance';

export async function fetchMedicationHistory(id: number): Promise<
  {
    approval_name: string;
    doctor_name: string; // '-' for no doctor
    patient_name: string; // '-' for no patient
    qty_changed: number;
    qty_remaining: number;
    date: string;
  }[]
> {
  const response = await axiosInstance.get(
    `/medication_history/?medicine_id=${id}`
  );
  return response.data;
}
