import { Doctor } from './Doctor';
import { Medication } from './Medication';
import { Order } from './Order';

export type MedicationReview = {
  id: number;
  approval: Doctor;
  medicine: Medication;
  quantity_changed: number;
  quantity_remaining: number;
  date: string;
  order_status: string;
  order?: Order;
};
