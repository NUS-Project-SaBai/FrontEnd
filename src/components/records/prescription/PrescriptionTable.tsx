'use client';

export function PrescriptionTable({
  prescriptions,
}: {
  prescriptions: {
    consult_id: number;
    visit_date: string;
    medication: string;
    quantity: number;
    notes: string;
    status: string;
  }[];
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
          {prescriptions.map((prescription, i) => (
            <tr
              key={i}
              className={
                prescription.status == 'APPROVED'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }
            >
              <td>{prescription.medication}</td>
              <td>{Math.abs(prescription.quantity)}</td>
              <td>{prescription.notes}</td>
              <td>{prescription.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
