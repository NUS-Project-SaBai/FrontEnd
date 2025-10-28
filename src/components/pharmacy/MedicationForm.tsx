'use client';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { LoadingUI } from '@/components/LoadingUI';
import { Medication } from '@/types/Medication';
import { FormEventHandler } from 'react';

export function MedicationForm({
  onSubmit,
  isSubmitting = false,
  editMedication = null,
}: {
  onSubmit: FormEventHandler;
  isSubmitting?: boolean;
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
        <RHFInputField label="Code" name="code" type="text" />
        {editMedication != null && (
          <DisplayField
            label="Current Quantity"
            content={editMedication.quantity.toString()}
          />
        )}
        <RHFInputField
          label="Quantity to Add (Negative to subtract)"
          name="quantity_changed"
          type="number"
          isRequired={editMedication == null} // Only required for adding new medicine
        />
        <RHFInputField
          label="Warning Quantity (System will flag out when medication stock falls below this quantity). To remove warning, leave blank or 0."
          name="warning_quantity"
          type="number"
          isRequired={false}
          validate={{
            min: val =>
              val == null ||
              val >= 0 ||
              'Warning Quantity should be greater than or equal to 0',
          }}
        />
        <RHFInputField label="Notes" name="notes" type="text" />
        <div className="flex">
          {isSubmitting ? (
            <LoadingUI message="Submitting medication..." />
          ) : (
            <Button text="Submit" colour="green" type="submit" />
          )}
        </div>
      </form>
    </div>
  );
}
