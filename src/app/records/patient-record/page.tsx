'use server';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { getPatientById } from '@/data/patient/getPatient';
import { PatientRecordBody } from './PatientRecordBody';

export default async function PatientRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  // const { id: patientId = '', visit: visitId = '' } = await searchParams;
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
      {/* <div className="grid grid-cols-2 gap-1 md:gap-4">
        {visits == null ? (
          <div className="w-fit text-nowrap text-lg">
            <LoadingUI message="Loading Visits..." />
          </div>
        ) : visits.length == 0 ? (
          <div>
            <p>No Visits Found</p>
          </div>
        ) : (
          <div>
            <VisitDropdown name="visit_date" visits={visits} />
          </div>
        )}
        <ViewVital
          consults={consults || []}
          patient={patient}
          vitals={vitals}
        />
        <EditPatient patient={patient} />
        <PrescriptionConsultCol consults={consults} />
      </div> */}
    </div>
  );
}
