import { LoadingUI } from '@/components/LoadingUI';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { HeightWeightGraph } from '@/components/records/vital/HeightWeightGraph';
import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
import { PrescriptionConsultCol } from '@/components/records/VitalPresConsultCol';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisitById } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { calculateDobDifference } from '@/types/Patient';
import { EMPTY_VITAL } from '@/types/Vital';
import { VitalsForm } from './VitalsForm';

export default async function PatientVitalPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId, visit: visitId } = await searchParams;
  if (visitId == undefined) {
    return (
      <div className="p-2">
        <h1>Patient Vitals</h1>
        <div className="border-b-2 py-2">
          <PatientInfoHeaderSection patient={await getPatientById(patientId)} />
        </div>
        <div>
          <LoadingUI message="Loading data..." />
        </div>
      </div>
    );
  }

  const [patient, curVital, visitDate, consults] = await Promise.all([
    getPatientById(patientId),
    getVitalByVisit(visitId).then(vital => vital || EMPTY_VITAL),
    getVisitById(visitId).then(visit =>
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
          <h2>Past Vitals</h2>
          <PastVitalTable
            vital={curVital}
            age={patientVisitAge}
            gender={patient.gender}
          />
          <PrescriptionConsultCol consults={consults} />
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
