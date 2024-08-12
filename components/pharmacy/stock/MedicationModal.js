import React from 'react';
import CustomModal from '@/components/CustomModal';

import {
  Button,
  InputField,
  InputBox,
  DisplayField,
} from '@/components/TextComponents/';

export function MedicationModal({
  modalIsOpen,
  toggleModal,
  onSubmit,
  handleInputChange,
  formDetails,
}) {
  return (
    <CustomModal
      isOpen={modalIsOpen}
      onRequestClose={toggleModal}
      content={
        <div className="space-y-4">
          <label className="flex items-center justify-center text-3xl font-bold text-sky-800 mb-4">
            Edit Medication
          </label>

          <InputField
            name="medicine_name"
            type="text"
            label="Medicine Name"
            onChange={handleInputChange}
            value={formDetails.medicine_name}
          />
          <DisplayField
            content={formDetails.quantity == null ? 0 : formDetails.quantity}
            label="Current Quantity"
          />

          <InputField
            label="Quantity to Add (Negative to subtract)"
            name="quantityChange"
            type="number"
            onChange={handleInputChange}
            value={formDetails.quantityChange}
          />

          <InputBox
            label="Notes"
            name="notes"
            className="textarea"
            placeholder="Textarea"
            onChange={handleInputChange}
            value={formDetails.notes}
          />

          <Button onClick={onSubmit} text="Submit" colour="green" />
        </div>
      }
    />
  );
}
