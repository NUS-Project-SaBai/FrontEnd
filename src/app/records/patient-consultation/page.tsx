import { PatientInfoHeaderSection } from '@/components/records/PatientInfoHeaderSection';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisitById } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { calculateDobDifference } from '@/types/Patient';
import { EMPTY_VITAL } from '@/types/Vital';
import { PrescriptionTable } from '../patient-record/PrescriptionTable';
import { RecordConsultationTable } from '../patient-record/RecordConsultationTable';
import { PastVitalTable } from '../patient-vitals/PastVitalTable';
import { ConsultationForm } from './ConsultationForm';

export default async function PatientConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId, visit: visitId } = await searchParams;

  const [patient, vitals, visit, consults] = await Promise.all([
    getPatientById(patientId),
    getVitalByVisit(visitId),
    getVisitById(visitId),
    getConsultByVisitId(visitId),
  ]);

  return (
    <div className="flex h-full flex-col p-2">
      <h1>Patient Consultation</h1>
      <div>
        <PatientInfoHeaderSection patient={patient} />
      </div>
      <hr className="my-2 w-full border-t-2" />
      <div className="grid flex-grow grid-cols-2 gap-x-2">
        <div>
          <h2>Vitals</h2>
          <PastVitalTable
            vital={vitals || EMPTY_VITAL}
            age={calculateDobDifference(
              new Date(patient.date_of_birth),
              visit == null ? new Date() : new Date(visit?.date)
            )}
            gender={patient.gender}
          />
          <h2>Consultations</h2>
          {consults == null ? (
            <p>loading</p>
          ) : (
            <RecordConsultationTable consults={consults} />
          )}
          <h2>Prescriptions</h2>
          {consults == null ? (
            <p>loading</p>
          ) : (
            <PrescriptionTable
              prescriptions={
                consults?.flatMap(consult => consult.prescriptions) || []
              }
            />
          )}
        </div>
        <div className="mb-2">
          <ConsultationForm visitId={visitId} patient={patient} />
        </div>
      </div>
    </div>
  );
}
