import { PatientInfoDetailSection } from '@/components/records/PatientInfoDetailSection';
import { PatientInfoHeaderSection } from '@/components/records/PatientInfoHeaderSection';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { getVitalByVisit } from '@/data/vital/getVital';
import { EMPTY_VITAL } from '@/types/Vital';
import { EditPatient } from './EditPatient';
import { PrescriptionTable } from './PrescriptionTable';
import { RecordConsultationTable } from './RecordConsultationTable';
import { ViewVital } from './ViewVital';

export default async function PatientRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId = '', visit: visitId = '' } = await searchParams;

  const [patient, consults, vitals] = await Promise.all([
    getPatientById(patientId),
    getConsultByVisitId(visitId),
    getVitalByVisit(visitId),
  ]);

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
          <ViewVital
            consults={consults || []}
            patient={patient}
            vitals={vitals || EMPTY_VITAL}
          />
          <EditPatient patient={patient} />
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
