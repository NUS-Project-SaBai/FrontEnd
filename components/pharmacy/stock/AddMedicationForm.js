import React, { useState } from 'react';

import {
  InputField,
  InputBox,
  DisplayField,
} from '@/components/TextComponents/';

export function AddMedicationForm({ handleInputChange, medicationDetails, setMedicationDetails, medications}) {
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditMessage, setIsEditMessage] = useState(false);

  console.log(medications);
  
  const handleMedicineNameChange = (e) => {
    handleInputChange(e); 

    const query = e.target.value.toLowerCase();
    if (query) {
      const filtered = medications.filter(medication =>
        medication.medicine_name.toLowerCase().includes(query)
      );
      setFilteredMedications(filtered);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleMedicationSelect = (medication) => {
    setMedicationDetails(medication);
    setIsDropdownOpen(false);
    setIsEditMessage(true);
  };


  return (
    <div className="space-y-2">
      <label className="flex items-center justify-center text-3xl font-bold text-sky-800 mb-2">
        {isEditMessage ? "Edit Medication" : "Add Medication"}
      </label>

      <InputField
        name="medicine_name"
        type="text"
        label="Medicine Name"
        onChange={handleMedicineNameChange}
        value={medicationDetails.medicine_name}
      />

      {isDropdownOpen && filteredMedications.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredMedications.map((medication, index) => (
            <li
              key={index}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handleMedicationSelect(medication)}
            >
              {medication.medicine_name}
            </li>
          ))}
        </ul>
      )}


      <DisplayField
        content={medicationDetails.quantity == null ? 0 : medicationDetails.quantity}
        label="Current Quantity"
      />

      <InputField
        label="Quantity to Add (Negative to subtract)"
        name="quantityChange"
        type="number"
        onChange={handleInputChange}
        value={medicationDetails.quantityChange}
        allowNegativeNumbers
      />

      <InputBox
        label="Notes"
        name="notes"
        className="textarea"
        placeholder="Textarea"
        onChange={handleInputChange}
        value={medicationDetails.notes}
      />
    </div>
  );
}
