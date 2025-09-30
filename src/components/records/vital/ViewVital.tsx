'use client';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
import { Consult } from '@/types/Consult';
import { calculateDobDifference, Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';
import { useState } from 'react';

export function ViewVital({
  patient,
  consults,
  vitals,
}: {
  patient: Patient;
  consults: Pick<Consult, 'id' | 'date' | 'doctor' | 'referred_for'>[];
  vitals: Vital | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button
        text="View Vitals"
        colour="indigo"
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        title="Vitals"
        text="Close"
      >
        <h2>Vitals</h2>
        {vitals == null ? (
          <p>No vitals found for current visit</p>
        ) : (
          <PastVitalTable
            vital={vitals}
            age={calculateDobDifference(
              new Date(patient.date_of_birth),
              consults.length == 0 ? new Date() : new Date(consults[0].date)
            )}
            gender={patient.gender}
          />
        )}
        <Button text="Close" onClick={closeModal} colour="red" />
      </Modal>
    </>
  );
}
