import { LoadingUI } from '@/components/LoadingUI';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { VisionForm } from '@/components/vision/VisionForm';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisionByVisit } from '@/data/vision/getVision';
import { getVitalByVisit } from '@/data/vital/getVital';
import { EMPTY_VISION } from '@/types/Vision';
import { EMPTY_VITAL } from '@/types/Vital';

export default async function PatientVisionPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId, visit: visitId } = await searchParams;
  if (visitId == undefined) {
    return (
      <div className="p-2">
        <h1>Patient Glasses Details</h1>
        <div className="border-b-2 py-2">
          <PatientInfoHeaderSection patient={await getPatientById(patientId)} />
        </div>
        <div>
          <LoadingUI message="Loading data..." />
        </div>
      </div>
    );
  }

  const [patient, curVision, curVital] = await Promise.all([
    getPatientById(patientId),
    getVisionByVisit(visitId).then(vision => vision ?? EMPTY_VISION),
    getVitalByVisit(visitId).then(vital => vital ?? EMPTY_VITAL),
  ]);

  return (
    <div className="p-2">
      <h1>Patient Glasses Details</h1>
      <div className="border-b-2 py-2">
        <PatientInfoHeaderSection patient={patient} />
      </div>

      <div className="mx-4 mt-4">
        <h2 className="mb-2 text-lg font-semibold">Add/Update Glasses</h2>
        <VisionForm
          visitId={visitId}
          curVision={curVision}
          curVitals={curVital}
        />
      </div>
    </div>
  );
}
