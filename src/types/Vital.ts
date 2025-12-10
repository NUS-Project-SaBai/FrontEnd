import { Visit } from './Visit';

//35 fields excluding id, visit_id.
export type Vital = {
  id?: number;
  visit?: Visit;
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
  hbA1c?: number;
  left_eye_degree: string;
  right_eye_degree: string;
  left_eye_pinhole: string;
  right_eye_pinhole: string;
  left_astigmatism: string;
  right_astigmatism: string;
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

/*
 Normalises visual acuity input to standard "6/X" format.
 Handles notation like "6/20 + 2" where the addition value is added to the denominator.
 Examples:
 - "6/20 + 2" -> "6/22"
 - "6/6" -> "6/6"
 - "6/12 + 1" -> "6/13"
 @param visualAcuity - The visual acuity value to normalize
 @returns The normalized visual acuity string in "6/X" format
*/
export function normalizeVisualAcuityValues(
  visualAcuity: string | undefined
): string {
  if (!visualAcuity) return '';

  const trimmed = visualAcuity.trim();

  //Match standard "6/X" format, already normalized
  const standardFormat = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (standardFormat) {
    return trimmed;
  }

  //Handling of non-normalized notation like "6/20 + 2"
  const matchWithAddition = trimmed.match(/^(\d+)\s*\/\s*(\d+)\s*\+\s*(\d+)$/);

  if (matchWithAddition) {
    //If regex finds a match, it returns the first 3 numbers and calculates new denominator
    const numerator = parseFloat(matchWithAddition[1]);
    const denominator = parseFloat(matchWithAddition[2]);
    const addition = parseFloat(matchWithAddition[3]);
    const newDenominator = denominator + addition;
    return `${numerator}/${newDenominator}`;
  }

  return trimmed;
}

/*
 Returns boolean true if the denominator is >= 12 (indicating worse vision)\
 Checks if a visual acuity value indicates poor vision 6/12 or worse (eg. 6/12, 6/18, 6/24, etc.)
 Supports standard "6/X" notation where X is the denominator.
@param visualAcuity - The visual acuity value to check
@returns boolean true if the visual acuity value indicates poor vision
*/

export function isVisualAcuityPoor(visualAcuity: string | undefined): boolean {
  if (!visualAcuity) return false;

  const normalized = normalizeVisualAcuityValues(visualAcuity);
  const match = normalized.match(/^(\d+)\s*\/\s*(\d+)$/);

  if (!match) return false;

  const numerator = parseFloat(match[1]);
  const denominator = parseFloat(match[2]);

  if (numerator !== 6) {
    console.log(
      `Non standard visual acutiy numerator detected: ${visualAcuity}`
    );
    return false;
  }

  return denominator >= 15;
}

export const VISUAL_ACUITY_PATTERN =
  /^6\s*\/\s*(?:120|60|36|24|18|15|12|9|7\.5|6|5)(?:\s*\+\s*[1-3])?$/;

// Special visual acuity values for low vision cases
const SPECIAL_VISUAL_ACUITY_VALUES = ['CF', 'HM', 'LP', 'NLP'];

export default function isValidVisualAcuity(visualAcuity: string): boolean {
  // Check for special values first (case-insensitive)
  const upperValue = visualAcuity.toUpperCase().trim();
  if (SPECIAL_VISUAL_ACUITY_VALUES.includes(upperValue)) {
    return true;
  }

  // Check standard format
  return VISUAL_ACUITY_PATTERN.test(visualAcuity);
}

/**
 * validation function for visual acuity fields.
 * Validates visual acuity input format and returns either true (valid) or an error message.
 * Accepts standard formats (6/6, 6/12, 6/20 + 2) and special values (CF, HM, LP, NLP).
 * @param value - The visual acuity value to validate
 * @param required - Whether the field is required (default: false)
 * @returns true if valid, or an error message string if invalid
 */
export function validateVisualAcuity(
  value: string | undefined,
  required: boolean = false
): true | string {
  // Empty values are valid if field is not required
  if (!value || value.trim() === '') {
    return required ? 'Visual acuity is required' : (true as const);
  }

  const trimmedValue = value.trim();
  const normalized = normalizeVisualAcuityValues(trimmedValue);

  // Check both original format and normalized format using isValidVisualAcuity
  if (isValidVisualAcuity(trimmedValue) || isValidVisualAcuity(normalized)) {
    return true;
  }

  return 'Invalid format. Use format like 6/6, 6/12, 6/15 + 2, or special values: CF, HM, LP, NLP if patient is unable to read the biggest E';
}

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
  left_astigmatism: '',
  right_astigmatism: '',
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
