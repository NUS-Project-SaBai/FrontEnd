import { Patient } from './Patient';

export type Upload = {
  id: number;
  patient: Patient;
  file_path?: string;
  offline_file?: string;
  file_name: string;
  description: string;
  created_at: string;
};
