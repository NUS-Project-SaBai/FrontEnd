'use server';
import { LoadingUI } from '@/components/LoadingUI';
import { ConsultationForm } from '@/components/records/consultation/ConsultationForm';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { PrescriptionConsultCol } from '@/components/records/PrescriptionConsultCol';
import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
import { getPatientById } from '@/data/patient/getPatient';
import { Consult } from '@/types/Consult';
import { calculateDobDifference, Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';
import { fetchPatientConsultationInfo } from './api';
import { getVisitsByPatientId } from '@/data/visit/getVisit';
import { VisitDropdown } from '@/components/VisitDropdown';
import { DateTime } from 'luxon';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const patientVisits = await getVisitsByPatientId(patientId);

  if (visitDate == undefined) {
    return <h1>No Visit Found</h1>;
  }


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1>Patient Consultation</h1>
        
        {/* Patient info */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Patient information
          </h2>
          <PatientInfoHeaderSection patient={patient} />
        </section>

        {/* Visit selector */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Viewing consultation for visit on
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {DateTime.fromISO(visitDate.replace(" ", "T")).toLocaleString( // Luxon requires the T separator
                  DateTime.DATETIME_MED
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Select a different visit to compare historical consultations.
              </p>
            </div>

            <div className="w-full md:w-auto md:min-w-[260px]">
              <VisitDropdown
                name="visit"
                visits={patientVisits}
                placeholder={DateTime.fromISO(visitDate.replace(" ", "T")).toLocaleString(DateTime.DATE_MED)}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {visitId == undefined ? (
          <LoadingUI message="Loading data..." />
        ) : (
          <MainBody
            vitals={vitals ?? null}
            consults={consults ?? null}
            patient={patient}
            visitId={visitId}
            visitDate={visitDate ? new Date(visitDate) : new Date()}
            prescriptions={prescriptions ?? []}
          />
        )}
      </div>
    </div>
  );
}

function MainBody({
  vitals,
  consults,
  patient,
  visitId,
  visitDate,
  prescriptions,
}: {
  vitals: Vital | null;
  consults: Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>[] | null;
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
    <section className="grid gap-4 lg:gap-6 lg:grid-cols-2">
      {/* Vitals card */}
      <div className="order-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 h-[calc(100vh-100px)] overflow-hidden">
        <ScrollArea className="h-full">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Patient Vitals
          </h2>
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
          <div className="mt-6 border-t border-slate-200 pt-6">
            <PrescriptionConsultCol
              consults={consults}
              prescriptions={prescriptions}
            />
          </div>
        </ScrollArea>
      </div>

      <div className="order-2 rounded-xl border border-slate-200 bg-white shadow-sm h-[calc(100vh-100px)] overflow-hidden">
        <ScrollArea className="h-full">
          <ConsultationForm visitId={visitId} patient={patient} />
        </ScrollArea>
      </div>
    </section>
  );
}
