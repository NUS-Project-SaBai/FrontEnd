export function VisitPrescriptionsTable({ content: prescriptions }) {
  const prescriptionRows = prescriptions.map((prescription) => {
    console.log(prescription);
    const name = prescription?.medicine?.medicine_name;
    const quantity = prescription.quantity;
    // let doctor = prescription.doctor

    return (
      <tr key={prescription.id}>
        <td class="py-2 px-2 border-b border-gray-200 align-middle">{name}</td>
        <td class="py-2 px-2 border-b border-gray-200 align-middle">
          {quantity}
        </td>
      </tr>
    );
  });

  return (
    <div class="shadow-lg rounded-lg overflow-hidden ">
      <table className="w-full table-auto">
        <thead>
          <tr class="bg-gray-100">
            <th class="w-1/3 py-2 px-2 text-left text-gray-600 font-bold uppercase">
              Medicine Name
            </th>
            <th class="w-1/3 py-2 px-2 text-left text-gray-600 font-bold uppercase">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody>{prescriptionRows}</tbody>
      </table>
    </div>
  );
}
