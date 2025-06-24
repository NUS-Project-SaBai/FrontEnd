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
  const closeModal = () => setIsOpen(false);
  return (
    <>
      <Button
        colour="green"
        onClick={() => setIsOpen(true)}
        text={'New Patient'}
      />
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <PatientForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        <Button colour="red" onClick={closeModal} text="Close" />
      </ReactModal>
    </>
  );
}
