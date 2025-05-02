import { HeightWeightGraph } from '@/components/records/HeightWeightGraph';
import { PatientInfoHeaderSection } from '@/components/records/PatientInfoHeaderSection';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisitById } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { calculateDobDifference } from '@/types/Patient';
import { EMPTY_VITAL } from '@/types/Vital';
import { RecordConsultationTable } from '../patient-record/RecordConsultationTable';
import { PastVitalTable } from './PastVitalTable';
import { VitalsForm } from './VitalsForm';

export default async function PatientVitalPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const patientId = (await searchParams).id;
  const visitId = (await searchParams).visit;
  const [patient, curVital, visitDate, consults] = await Promise.all([
    getPatientById(patientId),
    visitId == undefined
      ? EMPTY_VITAL
      : getVitalByVisit(visitId).then(vital => vital || EMPTY_VITAL),
    visitId == undefined
      ? new Date()
      : getVisitById(visitId).then(visit =>
          visit == null ? new Date() : new Date(visit.date)
        ),
    getConsultByVisitId(visitId),
  ]);

  const patientVisitAge = calculateDobDifference(
    new Date(patient.date_of_birth),
    visitDate
  );
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
            age={patientVisitAge}
            gender={patient.gender}
          />
          <p>consults</p>
          <h2>Consultations</h2>
          {consults == null ? (
            <p>loading</p>
          ) : (
            <RecordConsultationTable consults={consults} />
          )}
          <p>prescription</p>
          <h2>HeightWeightGraph</h2>
          <HeightWeightGraph
            age={patientVisitAge.year}
            weight={parseFloat(curVital.weight)}
            height={parseFloat(curVital.height)}
            gender={patient.gender}
          />
        </div>
        <div>
          <VitalsForm patient={patient} visitId={visitId} curVital={curVital} />
        </div>
      </div>
    </div>
  );
}
