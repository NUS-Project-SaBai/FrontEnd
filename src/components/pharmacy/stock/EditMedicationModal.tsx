'use client';
import { Button } from '@/components/Button';
import { LoadingUI } from '@/components/LoadingUI';
import { MedicationForm } from '@/components/pharmacy/MedicationForm';
import {
  getMedication,
  getMedicationById,
} from '@/data/medication/getMedications';
import { patchMedicine } from '@/data/medication/patchMedication';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Medication } from '@/types/Medication';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';

export function EditMedicationModal({
  reloadAllMedications,
}: {
  reloadAllMedications: () => void;
}) {
  const [editMedication, setEditMedication] = useState<Medication | null>(null);
  const { isLoading, withLoading } = useLoadingState(true);
  const { isLoading: isSubmitting, withLoading: withLoadingSubmit } =
    useLoadingState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMedicationId = searchParams.get('edit');

  useEffect(() => {
    if (editMedicationId !== null) {
      const fetchMedication = withLoading(async () => {
        try {
          const result = await getMedicationById(Number(editMedicationId));
          setEditMedication(result);
        } catch (error) {
          console.error('Error fetching medication:', error);
          setEditMedication(null);
        }
      });

      fetchMedication();
    } else {
      setEditMedication(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMedicationId]);

  const closeModal = () => router.back();

  const useFormReturn = useForm({
    values: {
      id: editMedication?.id || null,
      medicine_name: editMedication?.medicine_name || '',
      code: editMedication?.code || '',
      notes: editMedication?.notes || '',
      quantity_changed: null,
    },
  });

  return (
    <ReactModal
      isOpen={editMedicationId != null}
      onRequestClose={closeModal}
      ariaHideApp={false}
    >
      {isLoading ? (
        <LoadingUI message="Loading medication data..." />
      ) : editMedication ? (
        <FormProvider {...useFormReturn}>
          <MedicationForm
            closeForm={closeModal}
            isSubmitting={isSubmitting}
            onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();

              useFormReturn.handleSubmit(
                async data => {
                  const handleSubmission = withLoadingSubmit(async () => {
                    // stop if there is no id
                    if (editMedication?.id == null) return;
                    // check if the medicine name already exists on another medicine
                    const curMedName = data.medicine_name.trim().toLowerCase();
                    const matchingMedicine = (await getMedication()).filter(
                      medicine =>
                        medicine.medicine_name.trim().toLowerCase() ===
                          curMedName && medicine.id != data.id
                    );
                    if (matchingMedicine.length > 0) {
                      toast.error(
                        `Error renaming: Medicine '${matchingMedicine[0].medicine_name}' already exists`
                      );
                      return;
                    }

                    const jsonPayload = {
                      medicine_name: data.medicine_name.trim(),
                      code: data.code.trim(),
                      quantityChange: Number(data.quantity_changed) || 0,
                      notes: data.notes as string,
                    };

                    const result = await patchMedicine(
                      editMedication.id,
                      jsonPayload
                    );
                    if (result == null) {
                      toast.error('Unknown Error Updating Medication');
                    } else {
                      toast.success('Updated medicine successfully');
                      reloadAllMedications();
                      closeModal();
                    }
                  });

                  await handleSubmission();
                },
                () => {
                  toast.error('Invalid/Missing Input');
                }
              )();
            }}
            editMedication={editMedication}
          />
        </FormProvider>
      ) : (
        <div className="p-8 text-center">
          <p className="mb-4 text-xl text-red-600">Medication not found</p>
          <Button onClick={closeModal} text="Close" colour="red" />
        </div>
      )}
    </ReactModal>
  );
}
