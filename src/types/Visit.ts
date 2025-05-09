import { Patient } from './Patient';

export type Visit = {
  id: string;
  patient: Patient;
  date: string;
  status: string;
};
