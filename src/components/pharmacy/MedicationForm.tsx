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
  isDirty = true
}: {
  onSubmit: FormEventHandler;
  isSubmitting?: boolean;
  editMedication?: Medication | null;
  isDirty?: boolean;
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
          valueAsNumber={true}
          isRequired={editMedication == null} // Only required for adding new medicine
        />
        <RHFInputField
          label="Warning Quantity (System will flag out when medication stock falls below this quantity). To remove warning, leave blank or 0."
          name="warning_quantity"
          type="number"
          valueAsNumber={true}
          isRequired={true}
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
          ) : editMedication == null ? (
            <Button text="Submit" colour="green" type="submit" />
          ) : isDirty ? (
            <Button text="Submit edit" colour="green" type="submit" />
          ) : (
            <div className="flex flex-col gap-2">
              <Button 
                text="Submit edit" 
                colour="red" // Note: Usually 'gray' is better for disabled states
                type="submit" 
                disabled={true} 
              />
              <p className="text-sm text-red-500 italic">
                Make a change before submitting
              </p>
            </div>  
          )
          }
        </div>
      </form>
    </div>
  );
}
