import { LoadingUI } from '@/components/LoadingUI';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { HeightWeightGraph } from '@/components/records/vital/HeightWeightGraph';
// import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
import { VitalsForm } from '@/components/records/vital/VitalsForm';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisitById } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { calculateDobDifference } from '@/types/Patient';
import { EMPTY_VITAL } from '@/types/Vital';

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

  const [curVital, { date: visitDate, patient: patient }] = await Promise.all([
    getVitalByVisit(visitId).then(vital => vital || EMPTY_VITAL),
    getVisitById(visitId).then(visit => ({
      ...visit,
      date: visit == null ? new Date() : new Date(visit.date),
    })),
  ]);
  if (!patient) {
    return (
      <div className="p-2">
        <p>Cannot find patient</p>
      </div>
    );
  }

  const patientVisitAge = calculateDobDifference(
    new Date(patient.date_of_birth),
    visitDate
  );

  // const gridStyle = (minWidth: number) => `m-2 grid flex-1 gap-2 border-t-2 pt-4 [grid-template-columns:repeat(auto-fit,minmax(${minWidth}px,1fr))]`;

  return (
    <div className="p-2">
      <h1>Patient Vitals</h1>
      <div className="border-b-2 py-2">
        <PatientInfoHeaderSection patient={patient} />
      </div>
      <div className="mb-4 mt-2 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* <div className={gridStyle(200)}> */}
        {/* <div>
          <h2>Past Vitals</h2>
          <PastVitalTable
            vital={curVital}
            age={patientVisitAge}
            gender={patient.gender}
          />
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
        </div> */}
        <div>
          <h2>Height-weight graph</h2>
          <HeightWeightGraph
            age={patientVisitAge.year}
            weight={parseFloat(curVital.weight)}
            height={parseFloat(curVital.height)}
            gender={patient.gender}
          />
        </div>
        <div>
          <h2>Vitals</h2>
          <VitalsForm patient={patient} visitId={visitId} curVital={curVital} />
        </div>
      </div>
    </div>
  );
}
