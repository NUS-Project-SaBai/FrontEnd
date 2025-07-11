'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Consult, consultFromJson } from '@/types/Consult';
import { OrderWithDiagnoses } from '@/types/Order';

export async function getPendingOrder(): Promise<OrderWithDiagnoses[]> {
  const pendingOrdersWithDiagnoses = (
    await axiosInstance.get('/orders/?order_status=PENDING')
  ).data;
  return pendingOrdersWithDiagnoses.map((val: OrderWithDiagnoses) => ({
    ...val,
    consult: consultFromJson(val.consult as Consult), // val.consult is an object, not a number
  }));
}
