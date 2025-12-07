'use client';
import { ConsultationForm } from '@/components/records/consultation/ConsultationForm';
import { PrescriptionConsultCol } from '@/components/records/PrescriptionConsultCol';
import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Consult } from '@/types/Consult';
import { calculateDobDifference, Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';
import { useState } from 'react';

export function MainBody({
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
  const [editConsultId, setEditConsultId] = useState<number | null>(null);

  return (
    <section className="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <div className="order-1 h-[calc(100vh-100px)] overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
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
              patient={patient}
            />
          </div>
        </ScrollArea>
      </div>

      <div className="order-2 h-[calc(100vh-100px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ScrollArea className="h-full">
          <ConsultationForm
            visitId={visitId}
            patient={patient}
            editConsultId={editConsultId}
            onEditComplete={() => {
              setEditConsultId(null);
              window.location.reload();
            }}
          />
        </ScrollArea>
      </div>
    </section>
  );
}
