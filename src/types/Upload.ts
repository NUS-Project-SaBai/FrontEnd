import { Patient } from './Patient';

export type Upload = {
  patient: Patient;
  files: UploadFile[];
};
