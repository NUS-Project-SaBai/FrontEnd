'use client';
import { LoadingUI } from '@/components/LoadingUI';
import { PrescriptionTable } from '@/components/records/prescription/PrescriptionTable';
import { Consult } from '@/types/Consult';
import { Patient } from '@/types/Patient';
import { RecordConsultationTableModal } from './consultation/RecordConsultationTableModal';

export function PrescriptionConsultCol({
  consults,
  prescriptions,
  showConsult = true,
  showPrescription = true,
  patient,
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
  patient: Patient;
}) {
  return (
    <div>
      {showConsult && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Patient Previous Consults
          </h2>
          <RecordConsultationTableModal consults={consults} patient={patient} />
        </div>
      )}

      {showPrescription && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Patient Previous Prescriptions
          </h2>
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
