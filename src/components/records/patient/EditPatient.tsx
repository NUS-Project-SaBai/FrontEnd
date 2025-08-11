'use client';
import { Button } from '@/components/Button';
import { PatientForm } from '@/components/records/patient/PatientForm';
import { patchPatient } from '@/data/patient/patchPatient';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';

export function EditPatient({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);

  const useFormReturn = useForm({
    defaultValues: {
      ...patient,
      date_of_birth: patient.date_of_birth.split('T')[0],
    },
  });
  const router = useRouter();
  return (
    <>
      <Button
        text="Edit Patient Details"
        colour="green"
        onClick={() => setIsOpen(true)}
      />
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <FormProvider {...useFormReturn}>
          <PatientForm
            closeForm={closeModal}
            onSubmit={e => {
              e.preventDefault();

              const formData = new FormData(e.target as HTMLFormElement);
              useFormReturn.handleSubmit(
                async fieldValues => {
                  formData.append(
                    'picture',
                    await urlToFile(
                      fieldValues.picture_url,
                      'patient_screenshot.jpg',
                      'image/jpg'
                    )
                  );
                  if (!fieldValues.patient_id) {
                    toast.error('Error updating patient');
                    return;
                  }
                  patchPatient(fieldValues.pk, formData).then(() => {
                    toast.success('Patient Updated!');
                    router.refresh();
                    closeModal();
                  });
                },
                () => {
                  toast.error('Error updating patient details');
                }
              )();
            }}
          />
        </FormProvider>
      </ReactModal>
    </>
  );
}
