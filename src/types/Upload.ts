import { Patient } from './Patient';
import { UploadFile } from './UploadFile';

export type Upload = {
  patient: Patient;
  files: UploadFile[];
};
