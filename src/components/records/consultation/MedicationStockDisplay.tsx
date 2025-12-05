import { DisplayField } from '@/components/DisplayField';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { Medication } from '@/types/Medication';
import {
  getInStockQuantityColour,
  getInStockQuantityText,
} from './utils/medicationUtils';

export function MedicationStockDisplay({
  medication,
  quantityInputByUser,
}: {
  medication: Medication | null;
  quantityInputByUser: number;
}) {
  const exceedsStockNow =
    medication != null &&
    !Number.isNaN(quantityInputByUser) &&
    quantityInputByUser > medication.quantity;

  return (
    <div className="grid grid-cols-2 gap-4">
      <DisplayField
        label="In Stock"
        highlight={medication ? getInStockQuantityColour(medication) : ''}
        content={medication ? getInStockQuantityText(medication) : '-'}
      />
      <div
        className={
          exceedsStockNow ? 'rounded-md p-2 ring-2 ring-red-500' : 'p-2'
        }
      >
        <RHFInputField
          name="quantity"
          label="Quantity to Order"
          type="number"
          isRequired={true}
        />
        {exceedsStockNow && (
          <p className="mt-1 text-sm text-red-600">
            Quantity exceeds available stock ({medication?.quantity ?? 0} in
            stock). You may need to wait a while for the order to go through.
          </p>
        )}
      </div>
    </div>
  );
}
