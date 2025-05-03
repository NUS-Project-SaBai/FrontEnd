import { Consult } from './Consult';
import { MedicationReview } from './MedicationReview';

export type Order = {
  consult: Consult;
  medication_review: MedicationReview;
  notes: string;
  remarks: string;
};
