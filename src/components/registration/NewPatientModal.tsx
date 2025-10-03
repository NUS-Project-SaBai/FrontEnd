import { Button } from '@/components/Button';
import { PatientForm } from '@/components/records/patient/PatientForm';
import { FormEvent, useState } from 'react';
import { Modal } from '../Modal';

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
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        title="New Patient"
        text="Close"
        className="mx-auto my-8"
      >
        <PatientForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        <Button colour="red" onClick={closeModal} text="Close" />
      </Modal>
    </>
  );
}
