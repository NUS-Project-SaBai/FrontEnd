import { Diagnosis } from './Diagnosis';
import { MedicationReview } from './MedicationReview';
import { Visit } from './Visit';

export type Order = {
  id: number;
  consult: number;
  medication_review: MedicationReview;
  notes: string;
  remarks: string;
  visit: Visit;
};

export interface OrderWithDiagnoses extends Order {
  diagnoses: Diagnosis[];
}
