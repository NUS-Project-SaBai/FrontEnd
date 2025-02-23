'use server';
import { axiosInstance } from '@/lib/axiosIntstance';
import { fromJson, Patient } from '@/types/Patient';

export async function createPatient(
  formData: FormData
): Promise<Patient | null> {
  try {
    return await axiosInstance
      .post('/patients', formData)
      .then(val => fromJson(val.data))
      .catch(err => {
        console.log(err);
        return null;
      });
  } catch (e) {
    console.error('Error in createPatient:', e);
    return null;
  }
}
