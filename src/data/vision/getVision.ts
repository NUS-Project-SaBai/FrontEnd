'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Vision, visionFromJson } from '@/types/Vision';
import { AxiosError } from 'axios';

export async function getVisionByVisit(
  visitId: string
): Promise<Vision | null> {
  if (!visitId) return null;

  try {
    const response = await axiosInstance.get(`/glasses/?visit=${visitId}`);
    const data = response.data;
    return visionFromJson(data);
  } catch (err) {
    // Use a type guard to narrow to AxiosError
    if (isAxiosError(err)) {
      if (err.response?.status === 404) {
        console.warn(`No vision record found for visit ${visitId}`);
        return null;
      }
    }

    console.error('Error in getVisionByVisit:', err);
    return null;
  }
}

// Helper function to narrow the error type
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}
