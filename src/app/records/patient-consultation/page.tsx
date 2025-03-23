import { PatientInfoHeaderSection } from '@/components/records/PatientInfoHeaderSection';
import { createConsult } from '@/data/consult/createConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { ConsultationForm } from './ConsultationForm';

export default async function PatientConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const patientId = (await searchParams).id;
  const patient = await getPatientById(patientId);
  return (
    <div className="flex h-full flex-col p-2">
      <h1>Patient Consultation</h1>
      <div>
        <PatientInfoHeaderSection patient={patient} />
      </div>
      <hr className="my-2 w-full border-t-2" />
      <div className="grid flex-grow grid-cols-2">
        <div>
          <p>vitals</p>
          <p>consults</p>
          <p>prescription</p>
        </div>
        <div className="mb-2">
          <ConsultationForm
            visitId={(await searchParams).visit}
            submitConsultation={createConsult}
          />
        </div>
      </div>
    </div>
  );
}
