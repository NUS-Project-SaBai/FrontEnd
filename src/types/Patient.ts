import { GenderType } from './Gender';
import { VillagePrefix } from './VillagePrefixEnum';
import { YesNoOption } from './YesNoOption';

export type Patient = {
  pk: number;
  village_prefix: Exclude<VillagePrefix, VillagePrefix.ALL>;
  name: string;
  identification_number: string;
  contact_no: string;
  gender: GenderType;
  date_of_birth: string;
  poor: YesNoOption;
  bs2: YesNoOption;
  sabai: YesNoOption;
  drug_allergy: string;
  face_encodings: string;
  picture_url: string;
  filter_string: string;
  patient_id: string;
  confidence: string;
};

/**
 * Get the age of a patient based on their date of birth.
 * @param patient - The patient object containing the date of birth
 * @param today - The date to calculate the age against (default is current date)
 */
export function getPatientAge(
  patient: Patient,
  today: Date = new Date()
): {
  year: number;
  month: number;
  day: number;
} {
  const dob = new Date(patient.date_of_birth);
  return calculateDobDifference(dob, today);
}

/**
 * Get the age of a patient based on their date of birth.
 * @param dob - The date of birth
 * @param today - The date to calculate the age against (default is current date)
 */
export function calculateDobDifference(
  dob: Date,
  today: Date = new Date()
): {
  year: number;
  month: number;
  day: number;
} {
  // calculate the difference in year, month, days
  let ageYears = today.getFullYear() - dob.getFullYear();
  let ageMonths = today.getMonth() - dob.getMonth();
  let ageDays = today.getDate() - dob.getDate();

  // Adjust for the case when the birthday hasn't occurred yet this year
  if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
    ageYears--;
    ageMonths += 12; // Add 12 months if the birthday hasn't occurred yet this year
  }

  // Adjust days if the day difference is negative
  if (ageDays < 0) {
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the previous month
    ageDays += lastMonth.getDate(); // Add the number of days in the last month
    ageMonths--; // Subtract one month
    if (ageMonths < 0) {
      ageMonths = 11; // If months go negative, set it to 11 and subtract one year
      ageYears--;
    }
  }
  return {
    year: ageYears,
    month: ageMonths,
    day: ageDays,
  };
}

export function patientFromJson(jsonObj: object): Patient | null {
  return jsonObj as Patient;
}
