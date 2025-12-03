'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { MedicationReview } from '@/types/MedicationReview';

export async function patchOrder(
  orderId: string,
  orderStatus: 'APPROVED' | 'CANCELLED'
): Promise<MedicationReview | { error: string }> {
  return axiosInstance
    .patch(`/orders/${orderId}/`, {
      order_status: orderStatus,
    })
    .then(val => val.data)
    .catch(err => ({
      error: err.response?.data?.error || 'Failed to update order status',
    }));
}
