import { Button } from '@/components/TextComponents/Button';

export function ConsultationsTable({ content: consults, buttonOnClick }) {
  if (consults.length == 0) {
    return (
      <div>
        <label className="text-base font-semibold leading-6 text-gray-900">
          Consultations
        </label>
        <h2>Not Done</h2>
      </div>
    );
  }

  const consultRows = consults.map(consult => {
    const doctor = consult.doctor.username;
    const referredFor = consult.referred_for || 'Not referred';

    return (
      <tr key={consult.id}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {doctor}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {referredFor}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <Button
            colour="indigo"
            text={'View'}
            onClick={() => buttonOnClick(consult)}
          />
        </td>
      </tr>
    );
  });

  return (
    <div>
      <label className="text-base font-semibold leading-6 text-gray-900">
        Consultations
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
                      Doctor
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Referral Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {consultRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
