import { Patient } from '@/types/Patient';
import { PatientInfoActionBar } from './PatientInfoActionBar';
import { PatientInfoDetailSection } from './PatientInfoDetailSection';
import { PatientInfoHeaderSection } from './PatientInfoHeaderSection';

export function PatientInfo({ patient }: { patient: Patient | null }) {
  if (patient == null) {
    return <></>;
  }

  return (
    <div>
      <PatientInfoHeaderSection patient={patient} />
      <PatientInfoDetailSection patient={patient} displayType="grid" />
      <PatientInfoActionBar patient={patient} />
    </div>
  );
}
