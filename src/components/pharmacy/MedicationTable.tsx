import { IconButton } from '@/components/IconButton';
import { Medication } from '@/types/Medication';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function MedicationTable({
  medications,
}: {
  medications: Medication[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th>Medication name</th>
            <th>Quantity</th>
            <th>Warning Quantity</th>
            <th>Code</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {medications.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-4 text-center text-xl text-gray-600"
              >
                No medications found
              </td>
            </tr>
          ) : (
            medications.map(medicine => (
              <MedicationItemRow key={medicine.id} medicine={medicine} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
function MedicationItemRow({ medicine }: { medicine: Medication }) {
  const ICON_CLASS_STYLE = 'h-6 w-6';

  const isBelowWarningQuantity: boolean =
    medicine.warning_quantity != null &&
    medicine.quantity < medicine.warning_quantity;
  const isCriticallyLow: boolean = 
    medicine.warning_quantity != null && 
    medicine.quantity < (medicine.warning_quantity / 2)

  return (
    <tr
      className={`${isCriticallyLow? 'bg-red-100' :isBelowWarningQuantity ? 'bg-red-50' : 'bg-green-50'} transition-colors`}
    >
      <td>{medicine.medicine_name}</td>
      <td>{medicine.quantity}</td>
      <td>{medicine.warning_quantity || '-'}</td>
      <td>{medicine.code || 'N/A'}</td>
      <td>
        <div className="flex justify-center gap-2">
          <Link href={'/pharmacy/stock?edit=' + medicine.id} prefetch={false}>
            <IconButton
              icon={<PencilSquareIcon className={ICON_CLASS_STYLE} />}
              colour="green"
              variant="solid"
              label="Edit medication"
            />
          </Link>
          <Link
            href={'/pharmacy/stock?view=' + medicine.id}
            prefetch={false}
            shallow={true}
          >
            <IconButton
              icon={<EyeIcon className={ICON_CLASS_STYLE} />}
              colour="indigo"
              variant="solid"
              label="View medication"
            />
          </Link>
        </div>
      </td>
    </tr>
  );
}
