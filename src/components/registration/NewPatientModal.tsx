import { Button } from '@/components/Button';
import { PatientForm } from '@/components/records/patient/PatientForm';
import { FormEvent, useState } from 'react';
import { Modal } from '../Modal';
import { UserPlusIcon } from 'lucide-react';

export function NewPatientModal({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}) {
  const ICON_CLASS_STYLE = 'h-5 w-5';

  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button
        colour="green"
        onClick={() => setIsOpen(true)}
        text={'New Patient'}
        Icon={<UserPlusIcon className={ICON_CLASS_STYLE} />}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        title="New Patient"
        text="Close"
        size='full'
      >
        <PatientForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </Modal>
    </>
  );
}
