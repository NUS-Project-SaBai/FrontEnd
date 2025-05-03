'use server';
import { axiosInstance } from '@/lib/axiosIntstance';
import { Medication } from '@/types/Medication';

type PatchMedication = Pick<Medication, 'medicine_name' | 'notes'> & {
  quantityChange: number;
};
export async function patchMedicine(
  medicationId: number,
  patchMedication: PatchMedication
): Promise<Medication | null> {
  return axiosInstance
    .patch(`/medications/${medicationId}`, patchMedication)
    .then(r => r.data);
}
