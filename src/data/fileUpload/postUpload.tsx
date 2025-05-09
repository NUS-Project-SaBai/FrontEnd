'use server';
import { axiosInstance } from '@/lib/axiosIntstance';

export async function postUpload(formData: FormData) {
  const r = await axiosInstance.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return r.data;
}
