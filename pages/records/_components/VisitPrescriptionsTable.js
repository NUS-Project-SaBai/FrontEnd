export function PrescriptionsTable({ content: prescriptions }) {
  if (prescriptions.length == 0) {
    return (
      <div>
        <label className="text-base font-semibold leading-6 text-gray-900">
          Prescriptions
        </label>
        <h2>Not Done</h2>
      </div>
    );
  }

  const prescriptionRows = prescriptions.map((prescription) => {
    const name =
      prescription.medicine.medicine_name ||
      "Prescription.medicine.medicine_name not found";
    const quantity = prescription.quantity;
    return (
      <tr key={prescription.id}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {name}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {quantity}
        </td>
      </tr>
    );
  });

  return (
    <div>
      <label className="text-base font-semibold leading-6 text-gray-900">
        Prescriptions
      </label>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Medicine Name
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {prescriptionRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
