import { PatientInfoActionBar } from '@/components/records/patient/PatientInfoActionBar';
import { PatientInfoDetailSection } from '@/components/records/patient/PatientInfoDetailSection';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { Patient } from '@/types/Patient';

export function PatientInfo({ patient }: { patient: Patient | null }) {
  if (patient == null) {
    return <></>;
  }

  return (
    <div>
      <PatientInfoHeaderSection patient={patient} />
      <PatientInfoDetailSection patient={patient} />
      <PatientInfoActionBar patient={patient} />
    </div>
  );
}
