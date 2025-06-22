'use server';
import { LoadingUI } from '@/components/LoadingUI';
import { PrescriptionConsultCol } from '@/components/records/VitalPresConsultCol';
import { VisitDropdown } from '@/components/VisitDropdown';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getVisitsByPatientId } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
import { Patient } from '@/types/Patient';
import { ViewVital } from './ViewVital';

export async function PatientRecordBody({ patient }: { patient: Patient }) {
  const visitId = patient.last_visit_id;

  const [visits, consults, vitals] = await Promise.all([
    getVisitsByPatientId(patient.pk.toString()),
    getConsultByVisitId(visitId),
    getVitalByVisit(visitId),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-1 flex-row gap-2">
        {visits == null ? (
          <div className="w-fit text-nowrap text-lg">
            <LoadingUI message="Loading Visits..." />
          </div>
        ) : visits.length == 0 ? (
          <p>No Visits Found</p>
        ) : (
          <VisitDropdown name="visit_date" visits={visits} />
        )}
        <div className="flex h-[40px] gap-2 self-end">
          <ViewVital
            consults={consults || []}
            patient={patient}
            vitals={vitals}
          />
        </div>
      </div>
      <PrescriptionConsultCol consults={consults} />
    </div>
  );
}
