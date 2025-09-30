'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { OrderWithDiagnoses } from '@/types/Order';

export async function getPendingOrder(): Promise<OrderWithDiagnoses[]> {
  const pendingOrdersWithDiagnoses = (
    await axiosInstance.get('/orders/?order_status=PENDING')
  ).data;
  return pendingOrdersWithDiagnoses;
}
