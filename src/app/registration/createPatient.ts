'use server';

import { axiosInstance } from '@/lib/axiosIntstance';

export async function createPatient(formData: FormData) {
  try {
    await axiosInstance.post('/patients', formData).catch(console.log);
  } catch (e) {
    console.error('Error in createPatient:', e);
  }
}
