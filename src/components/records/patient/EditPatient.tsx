'use client';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { PatientForm } from '@/components/records/patient/PatientForm';
import { patchPatient } from '@/data/patient/patchPatient';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        title="Edit Patient Details"
        text="Close"
      >
        <FormProvider {...useFormReturn}>
          <PatientForm
            closeForm={closeModal}
            onSubmit={e => {
              e.preventDefault();

              const formData = new FormData();
              useFormReturn.handleSubmit(
                async fieldValues => {
                  Object.entries(fieldValues).map(
                    ([key, value]) =>
                      value && formData.append(key, value.toString())
                  );

                  // only append picture if it's a new one
                  if (fieldValues.picture_url.startsWith('data:')) {
                    formData.append(
                      'picture',
                      await urlToFile(
                        fieldValues.picture_url,
                        'patient_screenshot.jpg',
                        'image/jpg'
                      )
                    );
                  } else {
                    formData.delete('picture');
                  }
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
      </Modal>
    </>
  );
}
