import { Medication } from '@/types/Medication';
import Link from 'next/link';
import { Button } from '../Button';

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
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {medications.length === 0 ? (
            <tr>
              <td
                colSpan={3}
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
  return (
    <tr>
      <td>{medicine.medicine_name}</td>
      <td>{medicine.quantity}</td>
      <td>{medicine.code || 'N/A'}</td>
      <td>
        <Link href={'/pharmacy/stock?edit=' + medicine.id} prefetch={false}>
          <Button text="Edit" colour="green" />
        </Link>
        <Link
          href={'/pharmacy/stock?view=' + medicine.id}
          prefetch={false}
          shallow={true}
        >
          <Button text="History" colour="blue" />
        </Link>
      </td>
    </tr>
  );
}
