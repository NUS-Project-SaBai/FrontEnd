// 'use client'
import { LoadingUI } from '@/components/LoadingUI';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { HeightWeightGraph } from '@/components/records/vital/HeightWeightGraph';
import { VitalsForm } from '@/components/records/vital/VitalsForm';
import { VisitDropdown } from '@/components/VisitDropdown';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisitById, getVisitsByPatientId } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { cn } from '@/lib/utils';
import { calculateDobDifference } from '@/types/Patient';
import { EMPTY_VITAL } from '@/types/Vital';
import { DateTime } from 'luxon';

export default async function PatientVitalPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  console.log("WHY IS THIS COMPONENT RERENDERING")
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
  // console.log("SERVER COMPONENT GROSS MOTOR: ", curVital.gross_motor)
  if (!patient) {
    return (
      <div className="p-2">
        <p>Cannot find patient</p>
      </div>
    );
  }

  const patientVisits = await getVisitsByPatientId(patientId);

  const patientVisitAge = calculateDobDifference(
    new Date(patient.date_of_birth),
    visitDate
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-4 max-w space-y-6">
        <h1>Patient Vitals</h1>

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
                Viewing vitals for visit on
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {DateTime.fromISO(visitDate.toISOString()).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Select a different visit to compare historical vitals.
              </p>
            </div>

            <div className="w-full md:w-auto md:min-w-[260px]">
              <VisitDropdown
                name="visit"
                visits={patientVisits}
                placeholder={DateTime.fromISO(
                  visitDate.toISOString()
                ).toLocaleString(DateTime.DATE_MED)}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Main content: vitals + graph */}
        <section className={cn(
                            "grid gap-4 lg:gap-6",
                            (patientVisitAge.year >= 2 && patientVisitAge.year <= 18)
                              ? "lg:grid-cols-2"
                              : "lg:grid-cols-1"
                          )}>

          {/* Vitals card */}
          <div className="order-1 rounded-xl border border-slate-200 bg-white shadow-sm">
            <VitalsForm
              patient={patient}
              visitId={visitId}
              curVital={curVital}
            />
          </div>

          {/* Graph card */}
          {(patientVisitAge.year >= 2 && patientVisitAge.year <= 18)  &&
            <div className="order-2 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2 p-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Patient Height–weight Trajectory Graph
                </h2>
                <p className="text-xs text-slate-500">
                  Age: {patientVisitAge.year} years
                </p>
              </div>

              <div className="relative w-full overflow-hidden rounded-md">
                <HeightWeightGraph
                  age={patientVisitAge.year}
                  weight={parseFloat(curVital.weight)}
                  height={parseFloat(curVital.height)}
                  gender={patient.gender}
                />
              </div>
            </div>
          }
        </section>
      </div>
    </div>
  );
}
