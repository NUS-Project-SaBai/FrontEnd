import { LoadingUI } from '@/components/LoadingUI';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { VisionForm } from '@/components/vision/VisionForm';
import { VisitDropdown } from '@/components/VisitDropdown';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisionByVisit } from '@/data/vision/getVision';
import { getVisitById, getVisitsByPatientId } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { EMPTY_VISION } from '@/types/Vision';
import { EMPTY_VITAL } from '@/types/Vital';
import { formatDate } from '@/utils/formatDate';

export default async function PatientVisionPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId, visit: visitId } = await searchParams;
  const patient = await getPatientById(patientId);
  if (visitId == undefined) {
    return (
      <div className="p-2">
        <h1>Patient Glasses Details</h1>

        {/* Patient info */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Patient information
          </h2>
          <PatientInfoHeaderSection patient={patient} />
        </section>

        <div>
          <LoadingUI message="Loading data..." />
        </div>
      </div>
    );
  }

  const [curVision, curVital, curVisit, patientVisits] = await Promise.all([
    getVisionByVisit(visitId).then(vision => vision ?? EMPTY_VISION),
    getVitalByVisit(visitId).then(vital => vital ?? EMPTY_VITAL),
    getVisitById(visitId),
    getVisitsByPatientId(patientId),
  ]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <h1>Patient Glasses Details</h1>

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
              {formatDate(curVisit!.date, 'datetime')}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Select a different visit to compare historical vitals.
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[260px]">
            <VisitDropdown
              name="visit"
              visits={patientVisits}
              placeholder={formatDate(curVisit!.date, 'datetime')}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <div className="order-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-2 text-lg font-semibold">Update Glasses</h2>
        <VisionForm
          visitId={visitId}
          curVision={curVision}
          curVitals={curVital}
        />
      </div>
    </div>
  );
}
