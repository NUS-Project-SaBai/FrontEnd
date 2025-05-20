'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Consult, consultFromJson } from '@/types/Consult';
import { MedicationReview } from '@/types/MedicationReview';

export async function getMedicationReviewById(
  id: string
): Promise<MedicationReview[]> {
  const r = (await axiosInstance.get(`/medication_review?medication_pk=${id}`))
    .data;
  r.map((val: MedicationReview) => {
    if (val.order == null || typeof val.order.consult == 'number') return val;
    val.order = {
      ...val.order,
      consult: consultFromJson(val.order.consult as Consult),
    };
    return val;
  });
  return r;
}
