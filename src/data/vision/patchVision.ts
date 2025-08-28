'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Vision } from '@/types/Vision';

export async function patchVision(data: Vision): Promise<Vision | null> {
  const { ...patchData } = data;

  try {
    const response = await axiosInstance.patch(
      `/glasses/${data.id}/`,
      patchData
    );
    return response.data;
  } catch (err) {
    console.error('Error in patchVision:', err);
    return null;
  }
}
