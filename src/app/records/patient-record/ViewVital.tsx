'use client';
import { Button } from '@/components/Button';
import { Consult } from '@/types/Consult';
import { calculateDobDifference, Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';
import { useState } from 'react';
import ReactModal from 'react-modal';
import { PastVitalTable } from '../patient-vitals/PastVitalTable';

export function ViewVital({
  patient,
  consults,
  vitals,
}: {
  patient: Patient;
  consults: Consult[];
  vitals: Vital;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button text="View Vitals" onClick={() => setIsOpen(true)} />
      <ReactModal isOpen={isOpen} ariaHideApp={false}>
        <h2>Vitals</h2>
        <PastVitalTable
          vital={vitals}
          age={calculateDobDifference(
            new Date(patient.date_of_birth),
            consults.length == 0 ? new Date() : new Date(consults[0].date)
          )}
          gender={patient.gender}
        />
        <Button text="Close" onClick={() => setIsOpen(false)} colour="red" />
      </ReactModal>
    </>
  );
}
