'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Vision, visionFromJson } from '@/types/Vision';

export async function createVision(data: Vision): Promise<Vision | null> {
  try {
    const response = await axiosInstance.post('/glasses/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return visionFromJson(response.data);
  } catch (err) {
    console.error('Error in createVision:', err);
    return null;
  }
}
