import { Button } from '@/components/Button';
import { PatientInfoDetailSection } from '@/components/records/PatientInfoDetailSection';
import { PatientInfoHeaderSection } from '@/components/records/PatientInfoHeaderSection';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { PrescriptionTable } from './PrescriptionTable';
import { RecordConsultationTable } from './RecordConsultationTable';

export default async function PatientRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const patientId: string = (await searchParams).id || '';
  const visitId: string = (await searchParams).visit || '';

  const patient = await getPatientById(patientId);
  const consults = await getConsultByVisitId(visitId);

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
      <div className="grid grid-cols-2 gap-1 md:gap-4">
        <div>
          <Button text="View Vitals" />
          <Button text="Edit Patient Details" />
          <PatientInfoDetailSection patient={patient} />
        </div>

        <div>
          <p className="font-bold">Consults</p>
          <RecordConsultationTable consults={consults} />
          <div>
            <p className="font-bold">Prescriptions</p>
            {consults == null ? (
              <p>Loading...</p>
            ) : (
              <PrescriptionTable
                prescriptions={
                  consults?.flatMap(consult => consult.prescriptions) || []
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
