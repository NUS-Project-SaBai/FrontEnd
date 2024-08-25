import React from 'react';
import { Button } from '@/components/TextComponents';

export function MedicationStockTable({
  medicationsFiltered,
  toggleModal,
  handleDelete,
  toggleMedicationHistoryModal,
}) {
  return medicationsFiltered.map(medication => {
    const medicationDetails = {
      ...medication,
      pk: medication.id,
      quantityChange: 0,
    };
    return (
      <tr key={medication.id}>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {medication.medicine_name}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {medication.quantity}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-5">
          <Button
            colour="green"
            text="Edit"
            onClick={() => toggleModal(medicationDetails)}
          />
          <Button
            colour="red"
            text="Delete"
            onClick={() => handleDelete(medicationDetails.pk)}
          />

          <Button
            colour="blue"
            text="History"
            onClick={() => toggleMedicationHistoryModal(medicationDetails)}
          />
        </td>
      </tr>
    );
  });
}
