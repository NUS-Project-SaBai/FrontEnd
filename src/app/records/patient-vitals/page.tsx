import { PatientInfoHeaderSection } from '@/components/records/PatientInfoHeaderSection';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisitById } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { calculateDobDifference } from '@/types/Patient';
import { EMPTY_VITAL } from '@/types/Vital';
import { PastVitalTable } from './PastVitalTable';
import { VitalsForm } from './VitalsForm';

export default async function PatientVitalPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const patientId = (await searchParams).id;
  const visitId = (await searchParams).visit;
  const [patient, curVital, visitDate] = await Promise.all([
    getPatientById(patientId),
    visitId == undefined
      ? EMPTY_VITAL
      : getVitalByVisit(visitId).then(vital => vital || EMPTY_VITAL),
    visitId == undefined
      ? new Date()
      : getVisitById(visitId).then(visit =>
          visit == null ? new Date() : new Date(visit.date)
        ),
  ]);

  return (
    <div className="p-2">
      <h1>Patient Vitals</h1>
      <div className="border-b-2 py-2">
        <PatientInfoHeaderSection patient={patient} />
      </div>
      <div className="mb-4 mt-2 grid grid-cols-2 gap-4">
        <div>
          <PastVitalTable
            vital={curVital}
            age={calculateDobDifference(
              new Date(patient.date_of_birth),
              visitDate
            )}
            gender={patient.gender}
          />
          <p>consults</p>
          <p>prescription</p>
          <p>HeightWeightGraph</p>
        </div>
        <div>
          <VitalsForm patient={patient} visitId={visitId} curVital={curVital} />
        </div>
      </div>
    </div>
  );
}
