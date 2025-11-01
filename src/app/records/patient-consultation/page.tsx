'use server';
import { LoadingUI } from '@/components/LoadingUI';
import { AllConsultationTable } from '@/components/records/consultation/AllConsultationTable';
import { ConsultationForm } from '@/components/records/consultation/ConsultationForm';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { PrescriptionConsultCol } from '@/components/records/PrescriptionConsultCol';
import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
import { getPatientById } from '@/data/patient/getPatient';
import { Consult } from '@/types/Consult';
import { calculateDobDifference, Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';
import {
  fetchAllConsultsByPatientId,
  fetchPatientConsultationInfo,
} from './api';

export default async function PatientConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; visit?: string }>;
}) {
  const { id: patientId, visit: visitId } = await searchParams;
  if (patientId == undefined) {
    return <h1>No Patient Found</h1>;
  }

  const {
    patient,
    vitals,
    visit_date: visitDate,
    consults,
    prescriptions,
  } = visitId == undefined
    ? { patient: await getPatientById(patientId) }
    : await fetchPatientConsultationInfo(Number(visitId));

  const allConsults = (await fetchAllConsultsByPatientId(patientId)).flatMap(
    c => c.consults
  );

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
          vitals={vitals ?? null}
          consults={consults ?? null}
          allConsults={allConsults ?? null}
          patient={patient}
          visitId={visitId}
          visitDate={visitDate ? new Date(visitDate) : new Date()}
          prescriptions={prescriptions ?? []}
        />
      )}
    </div>
  );
}

function MainBody({
  vitals,
  consults,
  allConsults,
  patient,
  visitId,
  visitDate,
  prescriptions,
}: {
  vitals: Vital | null;
  consults: Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>[] | null;
  allConsults:
    | Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>[]
    | null;
  patient: Patient;
  visitId: string;
  visitDate: Date;
  prescriptions: {
    consult_id: number;
    visit_date: string;
    medication: string;
    quantity: number;
    notes: string;
    status: string;
  }[];
}) {
  return (
    <div className="grid grid-rows-2 gap-2">
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
          <PrescriptionConsultCol
            consults={consults}
            prescriptions={prescriptions}
          />
        </div>
        <div className="mb-2">
          <ConsultationForm visitId={visitId} patient={patient} />
        </div>
      </div>
      <div className="mb-2">
        <h2>All Consults</h2>
        <AllConsultationTable consults={allConsults} />
      </div>
    </div>
  );
}
