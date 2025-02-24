'use client';
import { Button } from '@/components/Button';
import { createPatient } from '@/data/patient/createPatient';
import { createVisit } from '@/data/visit/createVisit';
import useToggle from '@/hooks/useToggle';
import { urlToFile } from '@/utils/urlToFile';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';
import { PatientRegistrationForm } from './PatientRegistrationForm';

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
                async fieldValues => {
                  formData.append(
                    'picture',
                    await urlToFile(
                      fieldValues.picture,
                      'patient_screenshot.jpg',
                      'image/jpg'
                    )
                  );
                  const patient = await createPatient(formData);
                  if (patient == null) {
                    toast.error('Unknown error creating patient');
                    return;
                  }
                  useFormReturn.reset();
                  toast.success('Patient Created!');
                  // TODO: implement check for recent visit
                  createVisit(patient);
                  toast.success('New Visit Created!');
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
