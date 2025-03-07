import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axiosInstance from '@/pages/api/_axiosInstance';

export function MedicationHistoryForm({ medication }) {
  const [medicationHistory, setMedicationHistory] = useState([]);

  useEffect(() => {
    if (medication !== null) {
      axiosInstance
        .get(`/medication_review?medication_pk=${medication.pk}`)
        .then(response => {
          setMedicationHistory(response.data);
        })
        .catch(error => console.error('Error loading page', error));
    }
  }, []);

  useEffect(() => {
    renderRows();
  }, [medicationHistory]);

  function renderRows() {
    // Displays the list of medications in stock
    const tableRows = medicationHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(history => {
        const approval = history.approval.nickname;
        const patient_name = history.order.consult?.visit.patient.name || 'NA';
        const doctor = history.order.consult?.doctor.nickname || 'NA';
        const qty_changed = history.quantity_changed;
        const qty_remaining = history.quantity_remaining;
        const time = moment(history.date).format('DD MMMM YYYY HH:mm');

        return (
          <tr key={history.id}>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {approval}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {doctor}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {patient_name}
            </td>
            <td
              className={`whitespace-nowrap px-3 py-4 text-sm ${qty_changed >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {qty_changed >= 0 ? `+${qty_changed}` : qty_changed}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {qty_remaining}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {time}
            </td>
          </tr>
        );
      });
    return tableRows;
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-center text-3xl font-bold text-sky-800 mb-2">
        {medication?.medicine_name}
      </label>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Approval
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Doctor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Patient Name
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Quantity Changed
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Quantity Remaining
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Date and Time of Change
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {renderRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
