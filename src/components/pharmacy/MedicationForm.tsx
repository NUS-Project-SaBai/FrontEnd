'use client';
import { createMedicine } from '@/data/medication/createMedication';
import { getMedication } from '@/data/medication/getMedications';
import { Medication } from '@/types/Medication';
import { useEffect, useState } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../Button';
import { DisplayField } from '../DisplayField';
import { RHFInputField } from '../inputs/RHFInputField';

export function MedicationForm({ closeForm }: { closeForm: () => void }) {
  const { handleSubmit, reset } = useFormContext();
  const [medications, setMedications] = useState<Medication[]>([]);
  const reloadMedication = () =>
    getMedication().then(medications => setMedications(medications));
  useEffect(() => {
    reloadMedication();
  }, []);
  const submitMedicationFromHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(
      async (data: FieldValues) => {
        // check if the medicine name already exists
        const curMedName = data.medicine_name.trim().toLowerCase();
        const matchingMedicine = medications.filter(
          medicine => medicine.medicine_name.trim().toLowerCase() === curMedName
        );

        if (matchingMedicine.length > 0) {
          toast.error(
            `Medicine '${matchingMedicine[0].medicine_name}' already exists`
          );
          return;
        }

        const jsonPayload = {
          medicine_name: data.medicine_name as string,
          quantity: data.quantity as number,
          notes: data.notes as string,
        };

        createMedicine(jsonPayload).then(med => {
          toast.success(`Added Medicine: ${med.medicine_name}`);
          reset();
          reloadMedication();
        });
      },
      () => {
        toast.error('Invalid/Missing Input');
      }
    )();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Add New Medicine</h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={submitMedicationFromHandler}
      >
        <RHFInputField
          label="Medicine Name"
          name="medicine_name"
          type="text"
          isRequired={true}
        />
        <DisplayField label="Current Quantity" content="-" />
        <RHFInputField
          label="Quantity to Add (Negative to subtract)"
          name="quantity"
          type="number"
          isRequired={true}
        />
        <RHFInputField label="Notes" name="notes" type="text" />
        <div>
          <Button text="Close" colour="red" type="button" onClick={closeForm} />
          <Button text="Submit" colour="green" type="submit" />
        </div>
      </form>
    </div>
  );
}
