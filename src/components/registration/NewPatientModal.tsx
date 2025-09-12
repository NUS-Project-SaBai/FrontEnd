import { Button } from '@/components/Button';
import { PatientForm } from '@/components/records/patient/PatientForm';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import ReactModal from 'react-modal';

export function NewPatientModal({
  onSubmit,
  isSubmitting,
  modalState,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  modalState?: [boolean, Dispatch<SetStateAction<boolean>>];
}) {
  const localModalState = useState(false);
  const [modalIsOpen, setModalIsOpen] = modalState ?? localModalState;
  const closeModal = () => setModalIsOpen(false);
  return (
    <>
      <Button
        colour="green"
        onClick={() => setModalIsOpen(true)}
        text={'New Patient'}
      />
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <PatientForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        <Button colour="red" onClick={closeModal} text="Close" />
      </ReactModal>
    </>
  );
}
