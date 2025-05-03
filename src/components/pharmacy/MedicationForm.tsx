'use client';
import { Medication } from '@/types/Medication';
import { FormEventHandler } from 'react';
import { Button } from '../Button';
import { DisplayField } from '../DisplayField';
import { RHFInputField } from '../inputs/RHFInputField';

export function MedicationForm({
  closeForm,
  onSubmit,
  editMedication = null,
}: {
  closeForm: () => void;
  onSubmit: FormEventHandler;
  editMedication?: Medication | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        {editMedication == null
          ? 'Add New Medicine'
          : `Edit ${editMedication.medicine_name}`}
      </h2>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <RHFInputField
          label="Medicine Name"
          name="medicine_name"
          type="text"
          isRequired={true}
        />
        <DisplayField
          label="Current Quantity"
          content={
            editMedication == null ? '-' : editMedication.quantity.toString()
          }
        />
        <RHFInputField
          label="Quantity to Add (Negative to subtract)"
          name="quantity_changed"
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
