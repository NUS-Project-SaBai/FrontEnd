'use client';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { MedicationForm } from '@/components/pharmacy/MedicationForm';
import { createMedicine } from '@/data/medication/createMedication';
import { getMedication } from '@/data/medication/getMedications';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useSaveOnWrite } from '@/hooks/useSaveOnWrite';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function AddMedicationModal({
  reloadAllMedications,
}: {
  reloadAllMedications: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const { isLoading: isSubmitting, withLoading } = useLoadingState(false);

  const [formDetails, setFormDetails, clearLocalStorageData] = useSaveOnWrite(
    'AddMedicationModal',
    {} as FieldValues,
    []
  );
  const useFormReturn = useForm({ values: formDetails });
  useEffect(() => {
    const unsub = useFormReturn.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        setFormDetails(values);
      },
    });
    return () => unsub();
  }, [setFormDetails, useFormReturn]);
  const submitMedicationFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    useFormReturn.handleSubmit(
      async (data: FieldValues) => {
        try {
          const handleSubmission = withLoading(async () => {
            // check if the medicine name already exists
            const curMedName = data.medicine_name.trim().toLowerCase();
            const matchingMedicine = (await getMedication()).filter(
              medicine =>
                medicine.medicine_name.trim().toLowerCase() === curMedName
            );

            if (matchingMedicine.length > 0) {
              toast.error(
                `Medicine '${matchingMedicine[0].medicine_name}' already exists`
              );
              return;
            }

            const jsonPayload = {
              medicine_name: data.medicine_name.toString().trim(),
              code: data.code.toString().trim(),
              quantity: data.quantity_changed as number,
              warning_quantity: data.warning_quantity as number,
              notes: data.notes as string,
            };

            const med = await createMedicine(jsonPayload);
            toast.success(`Added Medicine: ${med.medicine_name}`);
            useFormReturn.reset({});
            clearLocalStorageData();
            reloadAllMedications();
            closeModal();
          });

          await handleSubmission();
        } catch (error) {
          console.error('Error submitting form:', error);
          toast.error('An error occurred while adding the medicine');
        }
      },
      () => {
        toast.error('Invalid/Missing Input');
      }
    )();
  };

  return (
    <>
      <Button
        text="Add"
        colour="green"
        Icon={<PlusIcon className="h-5 w-5" />}
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        title="Add New Medicine"
        text="Close"
      >
        <FormProvider {...useFormReturn}>
          <MedicationForm
            onSubmit={submitMedicationFormHandler}
            isSubmitting={isSubmitting}
          />
        </FormProvider>
      </Modal>
    </>
  );
}
