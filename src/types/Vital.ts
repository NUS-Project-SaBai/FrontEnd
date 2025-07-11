//35 fields excluding id, visit_id.
export type Vital = {
  id?: number;
  visit_id?: number;
  height: string;
  weight: string;
  temperature: string;
  systolic?: number;
  diastolic?: number;
  heart_rate?: number;
  hemocue_count: string;
  diabetes_mellitus: string;
  urine_test: string;
  blood_glucose_non_fasting?: number;
  blood_glucose_fasting?: number;
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

/**
 * Returns the BMI of the patient based on the height and weight.
 * If height or weight is invalid, returns 'Invalid/Missing Height or Weight'.
 * @param height - Height of the patient in cm
 * @param weight - Weight of the patient in kg
 */
export function displayBMI(height: string, weight: string) {
  return height == null ||
    isNaN(parseFloat(height)) ||
    weight == null ||
    isNaN(parseFloat(weight))
    ? 'Invalid/Missing Height or Weight'
    : (parseFloat(weight) / (parseFloat(height) / 100) ** 2)
        .toFixed(2)
        .toString();
}

export const EMPTY_VITAL: Vital = {
  id: undefined,
  visit_id: undefined,
  height: '',
  weight: '',
  temperature: '',
  systolic: undefined,
  diastolic: undefined,
  heart_rate: undefined,
  hemocue_count: '',
  diabetes_mellitus: '',
  urine_test: '',
  blood_glucose_non_fasting: undefined,
  blood_glucose_fasting: undefined,
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
