import { MedicationForm } from '@/components/pharmacy/MedicationForm';
import { getMedication } from '@/data/medication/getMedications';
import { patchMedicine } from '@/data/medication/patchMedication';
import { Medication } from '@/types/Medication';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';

export function EditMedicationModal() {
  const [medications, setMedications] = useState<Medication[]>([]);
  useEffect(() => {
    getMedication().then(medications => {
      setMedications(medications);
    });
  }, []);

  const searchParams = useSearchParams();

  const editMedicationId = searchParams.get('edit');
  const editMedication =
    medications.find(med => med.id.toString() === editMedicationId) || null;
  const router = useRouter();
  const closeModal = () => router.back();
  const useFormReturn = useForm({
    values: {
      id: editMedication?.id || null,
      medicine_name: editMedication?.medicine_name || '',
      notes: editMedication?.notes || '',
      quantity_changed: null,
    },
  });

  return (
    <ReactModal isOpen={editMedication != null} ariaHideApp={false}>
      <FormProvider {...useFormReturn}>
        <MedicationForm
          closeForm={closeModal}
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            useFormReturn.handleSubmit(
              async data => {
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
                  quantityChange: Number(data.quantity_changed) || 0,
                  notes: data.notes as string,
                };

                patchMedicine(editMedication.id, jsonPayload).then(data => {
                  if (data == null) {
                    toast.error('Unknown Error Updating Medication');
                  } else {
                    toast.success('Updated medicine successfully');
                    closeModal();
                  }
                });
              },
              () => {
                toast.error('Invalid/Missing Input');
              }
            )();
          }}
          editMedication={editMedication}
        />
      </FormProvider>
    </ReactModal>
  );
}
