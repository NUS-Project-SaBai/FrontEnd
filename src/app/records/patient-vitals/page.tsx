import { PatientInfoHeaderSection } from '@/components/records/PatientInfoHeaderSection';
import { getPatientById } from '@/data/patient/getPatient';
import { getVitalByVisit } from '@/data/vital/getVital';
import { VitalsForm } from './VitalsForm';

export default async function PatientVitalPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const patientId = (await searchParams).id;
  const visitId = (await searchParams).visit;
  const [patient, curVital] = await Promise.all([
    getPatientById(patientId),
    visitId == undefined ? null : getVitalByVisit(visitId),
  ]);

  return (
    <div className="p-2">
      <h1>Patient Vitals</h1>
      <div>
        <PatientInfoHeaderSection patient={patient} />
      </div>
      <div className="mb-4 mt-2 grid grid-cols-2 gap-4">
        <div>
          <p>vitals</p>
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
