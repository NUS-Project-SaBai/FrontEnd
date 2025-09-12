'use server';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
import { PrescriptionConsultCol } from '@/components/records/VitalPresConsultCol';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisitById } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { Consult } from '@/types/Consult';
import { calculateDobDifference, Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';
import { ConsultationForm } from './ConsultationForm';

export default async function PatientConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; visit?: string }>;
}) {
  const { id: patientId, visit: visitId } = await searchParams;
  if (patientId == undefined) {
    return <h1>No Patient Found</h1>;
  }

  const [patient, vitals, visit, consults] =
    visitId == undefined
      ? [await getPatientById(patientId), null, null, null]
      : await Promise.all([
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
      {visitId == undefined ? (
        <LoadingUI message="Loading data..." />
      ) : (
        <MainBody
          vitals={vitals}
          consults={consults}
          patient={patient}
          visitId={visitId}
          visitDate={visit?.date == null ? new Date() : new Date(visit?.date)}
        />
      )}
    </div>
  );
}

function MainBody({
  vitals,
  consults,
  patient,
  visitId,
  visitDate,
}: {
  vitals: Vital | null;
  consults: Consult[] | null;
  patient: Patient;
  visitId: string;
  visitDate: Date;
}) {
  return (
    <div className="grid flex-grow grid-cols-2 gap-x-2">
      <div>
        <h2>Vitals</h2>
        {vitals == null ? (
          <p>No vitals found for current visit</p>
        ) : (
          <PastVitalTable
            vital={vitals}
            age={calculateDobDifference(
              new Date(patient.date_of_birth),
              visitDate
            )}
            gender={patient.gender}
          />
        )}
        <PrescriptionConsultCol consults={consults} />
      </div>
      <div className="mb-2">
        <ConsultationForm visitId={visitId} patient={patient} />
      </div>
    </div>
  );
}
