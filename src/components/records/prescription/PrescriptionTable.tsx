'use client';
import { Prescription } from '@/types/Prescription';

export function PrescriptionTable({
  prescriptions,
}: {
  prescriptions: Prescription[];
}) {
  if (prescriptions.length === 0) {
    return <p>No Prescriptions Found</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="rounded-table text-left">
        <thead className="bg-gray-50">
          <tr>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Dosage Instructions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map(prescription => (
            <tr
              key={prescription.id}
              className={
                prescription.medication_review.order_status == 'APPROVED'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }
            >
              <td>{prescription.medication_review.medicine.medicine_name}</td>
              <td>
                {Math.abs(prescription.medication_review.quantity_changed)}
              </td>
              <td>{prescription.notes}</td>
              <td>{prescription.medication_review.order_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
