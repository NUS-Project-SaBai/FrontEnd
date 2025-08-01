import { Patient } from '@/types/Patient';
import { Vision } from '@/types/Vision';
import { Vital } from '@/types/Vital';

export async function fetchVisionData(
  patientId: number,
  visitId: number
): Promise<{
  patient: Patient;
  vision: Vision;
  vital: Pick<
    Vital,
    | 'right_eye_degree'
    | 'left_eye_degree'
    | 'right_eye_pinhole'
    | 'left_eye_pinhole'
  >;
}> {
  throw new Error('Function not implemented.' + patientId + visitId);
  return {
    patient: {} as Patient,
    vision: {} as Vision,
    vital: {
      right_eye_degree: '6/6',
      left_eye_degree: '6/6',
      right_eye_pinhole: '6/6',
      left_eye_pinhole: '6/6',
    },
  };
}
