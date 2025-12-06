import { Medication } from '@/types/Medication';

export function getInStockQuantityColour(
  medication: Medication | null
): 'bg-red-200' | 'bg-amber-200' | 'bg-green-200' | '' {
  if (medication == null) {
    return ''; // leave as grey
  }

  if (
    medication.warning_quantity == null ||
    medication.quantity >= medication.warning_quantity
  ) {
    return 'bg-green-200'; // highlight as green
  }

  if (medication.quantity < medication.warning_quantity) {
    return 'bg-red-200'; // highlight as red
  }

  return '';
}

export function getInStockQuantityText(medication: Medication | null): string {
  if (medication == null) {
    return '-';
  }

  if (
    medication.warning_quantity == null ||
    medication.quantity >= medication.warning_quantity
  ) {
    return medication.quantity.toString();
  }

  if (medication.quantity < medication.warning_quantity) {
    return medication.quantity.toString() + ' (Low Quantity)';
  }

  return '-';
}
