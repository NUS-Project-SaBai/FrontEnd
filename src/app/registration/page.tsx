'use client';
import { Button } from '@/components/Button';
import useToggle from '@/hooks/useToggle';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { createPatient } from './createPatient';

export default function RegistrationPage() {
  const useFormReturn = useForm({ resetOptions: { keepDirtyValues: true } });
  const [isPatientFormOpen, togglePatientFormOpen] = useToggle(false);
  return (
    <>
      <Button onClick={togglePatientFormOpen} text={'New Patient'} />
      <ReactModal isOpen={isPatientFormOpen} ariaHideApp={false}>
        <FormProvider {...useFormReturn}>
          <PatientRegistrationForm
            onSubmit={event => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);

              useFormReturn.handleSubmit(
                //onValid
                fieldValues => {
                  formData.append('picture', fieldValues.picture);
                  createPatient(formData);
                  useFormReturn.reset();
                  toast.success('Patient Created!');
                  togglePatientFormOpen();
                },
                // onInvalid
                () => {
                  toast.error('Missing Input');
                }
              )();
            }}
          />
        </FormProvider>
        <Button onClick={togglePatientFormOpen} text="Close" />
      </ReactModal>
    </>
  );
}
