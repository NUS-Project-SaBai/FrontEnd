'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { MedicationReview } from '@/types/MedicationReview';

export async function getMedicationReviewById(
  id: string
): Promise<MedicationReview[]> {
  return (await axiosInstance.get(`/medication_review/?medication_pk=${id}`))
    .data;
}
