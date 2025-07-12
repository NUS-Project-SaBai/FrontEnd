import { Consult } from './Consult';
import { Diagnosis } from './Diagnosis';
import { MedicationReview } from './MedicationReview';
import { Visit } from './Visit';

export type Order = {
  id: number;
  // TODO: standardise the type of this field, fix it either as id or object
  consult: Consult | number;
  medication_review: MedicationReview;
  notes: string;
  remarks: string;
  visit: Visit;
};

export interface OrderWithDiagnoses extends Order {
  diagnoses: Diagnosis[];
}
