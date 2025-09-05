'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Medication } from '@/types/Medication';

type PatchMedication = Pick<Medication, 'medicine_name' | 'notes'> & {
  quantityChange: number;
};
export async function patchMedicine(
  medicationId: number,
  patchMedication: PatchMedication
): Promise<Medication | null> {
  return axiosInstance
    .patch(`/medication/${medicationId}`, patchMedication)
    .then(r => r.data);
}
