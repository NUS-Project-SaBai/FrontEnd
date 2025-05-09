import { MedicationReview } from './MedicationReview';
import { Visit } from './Visit';

export type Prescription = {
  id: number;
  consult: number;
  visit: Visit;
  medication_review: MedicationReview;
  notes: string;
  remarks?: string;
};
