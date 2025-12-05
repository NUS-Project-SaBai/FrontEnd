'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { VillagePrefix } from '@/types/VillagePrefixEnum';

/**
 * Fetches the pending medication orders for all patient. Used in the main page.
 *
 * GET /api/pharmacy_orders/
 */
export async function fetchAllPatientMedicationOrders(): Promise<
  {
    patient: {
      patient_id: string;
      name: string;
      picture_url: string;
      village_prefix: VillagePrefix;
    };
    data: {
      orders: {
        order_id: number;
        medication_name: string;
        medication_code: string;
        quantity_changed: number;
        is_low_stock: boolean;
        notes: string;
      }[];
      diagnoses: { category: string; details: string }[];
      visit_id: number;
      visit_date: string;
    }[];
  }[]
> {
  // TODO: data.orders.id is the pk for that order, not medicine_id
  return axiosInstance.get('/pharmacy_orders/').then(res => res.data);
}
