'use server';
import { Button } from '@/components/Button';
import AllConsultationDetails from '@/components/records/consultation/AllConsultationDetails';
import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
import { getConsultsByPatientID } from '@/data/consult/getConsult';
import { getVisitsByPatientId } from '@/data/visit/getVisit';
import { getVitalsByPatientID } from '@/data/vital/getVital';
import { calculateDobDifference, Patient } from '@/types/Patient';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';

export async function PatientRecordBody({ patient }: { patient: Patient }) {
  const [visits, consults, vitals] = await Promise.all([
    getVisitsByPatientId(patient.pk.toString()),
    getConsultsByPatientID(patient.pk),
    getVitalsByPatientID(patient.pk),
  ]);

  if (!visits || !vitals || !consults) {
    return <div>No visits found</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-1 flex-row gap-2"></div>
      <div className="mx-2 flex flex-1 flex-col">
        <h1 className="py-0">Visits</h1>
        {visits.map(visit => {
          const thisVisitConsults = consults?.filter(
            v => v.visit.id == visit.id
          );
          console.log(vitals);
          const vital =
            vitals?.find(vital => vital.visit_id == visit.id) ?? null;

          const isLatestVisit = visit.id == patient.last_visit_id;

          const actionButtons = (
            <div className="flex gap-2 text-base">
              <Link
                href={`/records/patient-vitals?id=${patient.pk}&visit=${visit.id}`}
              >
                <Button text="Edit vitals" colour="red" />
              </Link>
              <Link
                href={`/records/patient-consultation?id=${patient.pk}&visit=${visit.id}`}
              >
                <Button text="New consultation" colour="indigo" />
              </Link>
            </div>
          );

          if (thisVisitConsults.length == 0 && !vital)
            return (
              <div
                key={visit.id}
                className={
                  'my-2 flex flex-1 items-center gap-2 text-lg ' +
                  (isLatestVisit ? '' : 'border-t-2 pt-3')
                }
              >
                <span className="font-bold">
                  {formatDate(visit.date, 'datetime')}
                  {': '}
                </span>
                {actionButtons}
                <div className="flex-1 text-center">no vitals or consult</div>
              </div>
            );

          return (
            <div
              key={visit.id}
              className={
                'my-2 flex flex-1 flex-col ' +
                (isLatestVisit ? '' : 'border-t-2 pt-4')
              }
            >
              <div className="flex flex-1 gap-2">
                <h2 className="text-lg font-bold">
                  {formatDate(visit.date, 'datetime')}
                </h2>
                {actionButtons}
              </div>
              <div className="mt-2 grid flex-1 grid-cols-2 gap-2">
                <div className="flex flex-1 rounded-lg border px-2">
                  {vital ? (
                    <div className="flex-1 pb-4">
                      <h1 className="pb-0 text-2xl">Vitals</h1>
                      <PastVitalTable
                        vital={vital}
                        gender={patient.gender}
                        age={calculateDobDifference(
                          new Date(patient.date_of_birth),
                          consults.length == 0
                            ? new Date()
                            : new Date(consults[0].date)
                        )}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 content-center text-center">
                      No vitals found
                    </div>
                  )}
                </div>
                <div className="flex flex-1 rounded-lg border px-2">
                  {thisVisitConsults.length > 0 ? (
                    <div className="flex-1 pb-4">
                      <h1 className="mb-2 text-2xl">Consultations</h1>

                      <AllConsultationDetails consults={thisVisitConsults} />
                    </div>
                  ) : (
                    <div className="flex-1 content-center text-center">
                      No consults found
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
