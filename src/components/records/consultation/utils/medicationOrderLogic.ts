import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Medication } from '@/types/Medication';

export const findMedicationById = (medications: Medication[], id: number) =>
  medications.find(med => med.id === id);

export const createOrder = (
  medication: Medication,
  data: { medication: string; quantity: number; notes: string }
): ConsultMedicationOrder => ({
  medicationId: medication.id,
  medicationName: medication.medicine_name,
  quantity: data.quantity || 0,
  notes: data.notes,
});

export const hasDuplicateOrder = (
  orders: ConsultMedicationOrder[],
  medicationId: number,
  excludeIndex?: number
) =>
  orders.some(
    (ord, idx) => ord.medicationId === medicationId && idx !== excludeIndex
  );
