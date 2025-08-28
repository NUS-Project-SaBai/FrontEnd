'use client';
import { LoadingUI } from '@/components/LoadingUI';
import { RecordConsultationTable } from '@/components/records/consultation/RecordConsultationTable';
import { PrescriptionTable } from '@/components/records/prescription/PrescriptionTable';
import { Consult } from '@/types/Consult';

export function PrescriptionConsultCol({
  consults,
  prescriptions,
  showConsult = true,
  showPrescription = true,
}: {
  consults: Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>[] | null;
  prescriptions: {
    consult_id: number;
    visit_date: string;
    medication: string;
    quantity: number;
    notes: string;
    status: string;
  }[];
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
            <PrescriptionTable prescriptions={prescriptions} />
          )}
        </div>
      )}
    </div>
  );
}
