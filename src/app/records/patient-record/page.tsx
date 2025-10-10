'use server';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { getPatientById } from '@/data/patient/getPatient';
import { PatientRecordBody } from './PatientRecordBody';

export default async function PatientRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId = '' } = await searchParams;

  const patient = await getPatientById(patientId);

  if (!patient) {
    return (
      <div>
        <h1>Patient Records</h1>
        <p>No patient found!</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h1>Patient Records</h1>
      <PatientInfoHeaderSection patient={patient} />
      <hr className="my-2 w-full border-t-2" />
      <PatientRecordBody patient={patient} />
    </div>
  );
}
