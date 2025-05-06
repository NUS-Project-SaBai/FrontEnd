import { Doctor } from './Doctor';
import { MedicationReview } from './MedicationReview';
import { Patient } from './Patient';
import { Prescription } from './Prescription';
import { Visit } from './Visit';

export type Consult = {
  id: number;
  patient: Patient;
  date: string;
  status: string;
  doctor: Doctor;
  prescriptions: Prescription[];
  medication_review: MedicationReview;
  past_medical_history: string;
  consultation: string;
  plan: string;
  referred_for?: string;
  referral_notes?: string;
  remarks?: string;
};

export function consultFromJson(
  jsonObj: Record<string, Consult[keyof Consult] | Visit>
): Consult {
  if (jsonObj && jsonObj.visit != undefined) {
    jsonObj = { ...jsonObj, patient: (jsonObj.visit as Visit).patient };
    delete jsonObj['visit'];
  }
  return jsonObj as Consult;
}
