import { Button } from '@/components/Button';
import { PatientForm } from '@/components/records/patient/PatientForm';
import { FormEvent, useState } from 'react';
import ReactModal from 'react-modal';

export function NewPatientModal({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        colour="green"
        onClick={() => setIsOpen(true)}
        text={'New Patient'}
      />
      <ReactModal isOpen={isOpen} ariaHideApp={false}>
        <PatientForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        <Button colour="red" onClick={() => setIsOpen(false)} text="Close" />
      </ReactModal>
    </>
  );
}
