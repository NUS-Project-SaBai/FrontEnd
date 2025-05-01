//35 fields excluding id, visit_id.
export type Vital = {
  id?: number;
  visit?: number;
  height: string;
  weight: string;
  temperature: string;
  systolic: string;
  diastolic: string;
  heart_rate: string;
  hemocue_count: string;
  diabetes_mellitus: string;
  urine_test: string;
  blood_glucose_non_fasting: string;
  blood_glucose_fasting: string;
  left_eye_degree: string;
  right_eye_degree: string;
  left_eye_pinhole: string;
  right_eye_pinhole: string;
  gross_motor: string;
  red_reflex: string;
  scoliosis: string;
  pallor: string;
  oral_cavity: string;
  heart: string;
  abdomen: string;
  lungs: string;
  hernial_orifices: string;
  pubarche: string;
  pubarche_age: string;
  thelarche: string;
  thelarche_age: string;
  menarche: string;
  menarche_age: string;
  voice_change: string;
  voice_change_age: string;
  testicular_growth: string;
  testicular_growth_age: string;
  others: string;
};

export function vitalFromJson(jsonObj: object): Vital | null {
  return jsonObj as Vital;
}

export const EMPTY_VITAL: Vital = {
  id: undefined,
  visit: undefined,
  height: '',
  weight: '',
  temperature: '',
  systolic: '',
  diastolic: '',
  heart_rate: '',
  hemocue_count: '',
  diabetes_mellitus: '',
  urine_test: '',
  blood_glucose_non_fasting: '',
  blood_glucose_fasting: '',
  left_eye_degree: '',
  right_eye_degree: '',
  left_eye_pinhole: '',
  right_eye_pinhole: '',
  gross_motor: '',
  red_reflex: '',
  scoliosis: '',
  pallor: '',
  oral_cavity: '',
  heart: '',
  abdomen: '',
  lungs: '',
  hernial_orifices: '',
  pubarche: '',
  pubarche_age: '',
  thelarche: '',
  thelarche_age: '',
  menarche: '',
  menarche_age: '',
  voice_change: '',
  voice_change_age: '',
  testicular_growth: '',
  testicular_growth_age: '',
  others: '',
};
