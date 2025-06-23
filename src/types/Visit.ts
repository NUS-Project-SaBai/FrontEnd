import { Patient } from './Patient';

export type Visit = {
  id: number;
  patient: Patient;
  date: string;
  status: string;
};
