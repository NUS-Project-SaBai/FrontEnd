import { MedicationForm } from '@/components/pharmacy/MedicationForm';
import { createMedicine } from '@/data/medication/createMedication';
import { getMedication } from '@/data/medication/getMedications';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';

export function AddMedicationModal({
  isOpen,
  closeForm,
}: {
  isOpen: boolean;
  closeForm: () => void;
}) {
  const useFormReturn = useForm();
  const submitMedicationFromHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    useFormReturn.handleSubmit(
      async (data: FieldValues) => {
        // check if the medicine name already exists
        const curMedName = data.medicine_name.trim().toLowerCase();
        const matchingMedicine = (await getMedication()).filter(
          medicine => medicine.medicine_name.trim().toLowerCase() === curMedName
        );

        if (matchingMedicine.length > 0) {
          toast.error(
            `Medicine '${matchingMedicine[0].medicine_name}' already exists`
          );
          return;
        }

        const jsonPayload = {
          medicine_name: data.medicine_name.toString().trim(),
          quantity: data.quantity as number,
          notes: data.notes as string,
        };

        createMedicine(jsonPayload).then(med => {
          toast.success(`Added Medicine: ${med.medicine_name}`);
          useFormReturn.reset();
        });
      },
      () => {
        toast.error('Invalid/Missing Input');
      }
    )();
  };
  return (
    <ReactModal isOpen={isOpen} ariaHideApp={false}>
      <FormProvider {...useFormReturn}>
        <MedicationForm
          closeForm={closeForm}
          onSubmit={submitMedicationFromHandler}
        />
      </FormProvider>
    </ReactModal>
  );
}
