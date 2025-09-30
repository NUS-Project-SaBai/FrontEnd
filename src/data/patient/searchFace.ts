'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';

export async function searchFace(imgDetails: string): Promise<Patient[]> {
  const scanFormData = new FormData();
  await urlToFile(imgDetails, 'patient_screenshot.jpg', 'image/jpg').then(
    file => scanFormData.append('picture', file)
  );
  return (await axiosInstance.post('/patients/search_face/', scanFormData))
    .data;
}
