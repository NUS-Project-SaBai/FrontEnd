'use server';

import { axiosInstance } from '@/lib/axiosInstance';

export async function patchOrder(
  orderId: string,
  orderStatus: 'APPROVED' | 'CANCELLED'
) {
  return axiosInstance
    .patch(`/orders/${orderId}`, {
      order_status: orderStatus,
    })
    .then(val => val.data)
    .catch(err => {
      console.error('Error patching order', err);
      return null;
    });
}
