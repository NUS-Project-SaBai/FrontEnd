'use server';

//import { axiosInstance } from '@/lib/axiosInstance';
import { EMPTY_VISION, Vision, visionFromJson } from '@/types/Vision';

// This function is similar to the getVitalByVisit function from getVitals.ts but the Vision type is used instead of Vital. Needs to add an actual /vision endpoint in the backend to work properly.
export async function getVisionByVisit(
  visitId: string
): Promise<Vision | null> {
  if (!visitId) return null;
  //let data = (await axiosInstance.get(`/vision?visit=${visitId}`)).data;
  const data = EMPTY_VISION; // Placeholder for actual data fetching logic

  // if (!data || data.length == 0) return null;
  // data = data[0];
  // data.visit = data.visit.id;

  if (!data) return null;
  return visionFromJson(data);
}
