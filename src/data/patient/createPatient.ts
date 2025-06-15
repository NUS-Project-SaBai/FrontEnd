'use server';
import { axiosInstance } from '@/lib/axiosInstance';
import { Patient, patientFromJson } from '@/types/Patient';

export async function createPatient(
  formData: FormData
): Promise<Patient | null> {
  try {
    console.log('Creating patient with formData:', formData);
    return await axiosInstance
      .post('/patients', formData)
      .then(val => patientFromJson(val.data))
      .catch(err => {
        console.log(err);
        return null;
      });
  } catch (e) {
    console.error('Error in createPatient:', e);
    return null;
  }
}
