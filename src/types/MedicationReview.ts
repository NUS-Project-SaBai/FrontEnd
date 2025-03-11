import { Doctor } from './Doctor';
import { Medicine } from './Medicine';

export type MedicationReview = {
  id: number;
  approval: Doctor;
  medicine: Medicine;
  quantity_changed: number;
  quantity_remaining: number;
  date: string;
  order_status: string;
};
