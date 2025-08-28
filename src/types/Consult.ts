import { MedicationReview } from './MedicationReview';
import { Patient } from './Patient';
import { Prescription } from './Prescription';

export type Consult = {
  id: number;
  patient: Patient;
  date: string;
  status: string;
  doctor: { nickname: string };
  prescriptions: Prescription[];
  medication_review: MedicationReview;
  past_medical_history: string;
  consultation: string;
  plan: string;
  referred_for?: string;
  referral_notes?: string;
  remarks?: string;
};
