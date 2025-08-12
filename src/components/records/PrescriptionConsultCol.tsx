'use client';
import { LoadingUI } from '@/components/LoadingUI';
import { RecordConsultationTable } from '@/components/records/consultation/RecordConsultationTable';
import { PrescriptionTable } from '@/components/records/prescription/PrescriptionTable';
import { Consult } from '@/types/Consult';

export function PrescriptionConsultCol({
  consults,
  showConsult = true,
  showPrescription = true,
}: {
  consults: Consult[] | null;
  showConsult?: boolean;
  showPrescription?: boolean;
}) {
  return (
    <div>
      {showConsult && (
        <div>
          <p className="font-bold">Consults</p>
          <RecordConsultationTable consults={consults} />
        </div>
      )}

      {showPrescription && (
        <div>
          <p className="font-bold">Prescriptions</p>
          {consults == null ? (
            <LoadingUI message="Loading Prescriptions..." />
          ) : (
            <PrescriptionTable
              prescriptions={
                consults?.flatMap(consult => consult.prescriptions) || []
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
