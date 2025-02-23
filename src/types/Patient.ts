import { VillagePrefix } from './VillagePrefixEnum';
import { YesNoOption } from './YesNoOption';

export type Patient = {
  pk: number;
  village_prefix: VillagePrefix;
  name: string;
  identification_number: string;
  contact_no: string;
  gender: string;
  date_of_birth: string;
  poor: YesNoOption;
  bs2: YesNoOption;
  sabai: YesNoOption;
  drug_allergy: string;
  face_encodings: string;
  picture: string;
  filter_string: string;
  patient_id: string;
  confidence: string;
};
export function fromJson(jsonObj: object): Patient | null {
  return jsonObj as Patient;
}
