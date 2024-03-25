import React from "react";

import { Button } from "../textContainers/Button";

export function MedicationForm({ onSubmit, handleInputChange, formDetails }) {
  return (
    <div>
      <label className="flex items-center justify-center text-3xl font-bold text-sky-800 mb-2">
        Edit Medication
      </label>

      <div className="field">
        <label className="label">Medicine Name</label>
        <div className="control">
          <input
            name="medicine_name"
            className="input"
            type="text"
            onChange={handleInputChange}
            value={formDetails.medicine_name}
          />
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <label className="label">Current Quantity</label>
          <div className="control">
            <label className="label">
              {formDetails.quantity == null ? 0 : formDetails.quantity}
            </label>
          </div>
        </div>

        <div className="control is-expanded">
          <label className="label">Add/ Subtract</label>
          <div className="control">
            <input
              name="quantityChange"
              className="input"
              type="number"
              onWheel={(e) => e.target.blur()}
              onChange={handleInputChange}
              value={formDetails.quantityChange}
            />
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Notes</label>
        <div className="control">
          <textarea
            name="notes"
            className="textarea"
            placeholder="Textarea"
            onChange={handleInputChange}
            value={formDetails.notes}
          />
        </div>
      </div>
      <Button onClick={onSubmit} text="Submit" colour="green" />
    </div>
  );
}
