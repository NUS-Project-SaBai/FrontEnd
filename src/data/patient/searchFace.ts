'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';

export async function searchFace(
  imgDetails: string
): Promise<{ data: Patient[]; isMockData: boolean }> {
  const scanFormData = new FormData();
  await urlToFile(imgDetails, 'patient_screenshot.jpg', 'image/jpg').then(
    file => scanFormData.append('picture', file)
  );
  const response = await axiosInstance.post(
    '/patients/search_face',
    scanFormData
  );
  console.log(response.headers);
  return {
    data: response.data,
    isMockData: response?.headers['x-is-mock-data'] === 'True',
  };
}
