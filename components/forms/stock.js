import React from "react";

import { Button } from "../textContainers/Button";
import { InputField } from "../textContainers/InputField";
import { InputBox } from "../textContainers/InputBox";
import { DisplayField } from "../textContainers/DisplayField";

export function MedicationForm({ onSubmit, handleInputChange, formDetails }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center justify-center text-3xl font-bold text-sky-800 mb-2">
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
        onWheel={(e) => e.target.blur()}
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
  );
}
