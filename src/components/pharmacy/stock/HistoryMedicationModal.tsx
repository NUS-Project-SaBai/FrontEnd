'use client';
import { fetchMedicationHistory } from '@/app/pharmacy/stock/api';
import { Button } from '@/components/Button';
import { LoadingUI } from '@/components/LoadingUI';
import { getMedicationById } from '@/data/medication/getMedications';
import { useLoadingState } from '@/hooks/useLoadingState';
import { formatDate } from '@/utils/formatDate';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

export type MedicationHistoryRowData = {
  approval_name: string;
  doctor_name: string; // '-' for no doctor
  patient_name: string; // '-' for no patient
  qty_changed: number;
  qty_remaining: number;
  date: string;
};
export function HistoryMedicationModal() {
  const [medicationHistory, setMedicationHistory] = useState<
    MedicationHistoryRowData[]
  >([]);
  const [medicationName, setMedicationName] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoadingState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMedicationId = searchParams.get('view');

  useEffect(() => {
    if (viewMedicationId !== null) {
      withLoading(async () => {
        try {
          const result = fetchMedicationHistory(Number(viewMedicationId));
          const medication = getMedicationById(Number(viewMedicationId));
          setMedicationName((await medication).medicine_name);
          setMedicationHistory(await result);
        } catch (error) {
          console.error('Error fetching medication history:', error);
          setMedicationHistory([]);
        }
      })();
    } else {
      setMedicationHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMedicationId]);

  const closeModal = () => router.back();

  return (
    <ReactModal
      isOpen={viewMedicationId != null}
      onRequestClose={closeModal}
      ariaHideApp={false}
    >
      <h2>{`View Medication ${medicationName ?? ''} History`}</h2>
      {isLoading ? (
        <LoadingUI message="Loading medication history..." />
      ) : (
        <>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th scope="col">Approval</th>
                <th scope="col">Doctor</th>
                <th scope="col">Patient Name</th>
                <th scope="col">Qty Changed</th>
                <th scope="col">Qty Remaining</th>
                <th scope="col">Date and Time of Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {medicationHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-600">
                    No history found for this medication
                  </td>
                </tr>
              ) : (
                medicationHistory
                  .sort((a, b) => (a.date > b.date ? -1 : 1))
                  .map((history, i) => (
                    <MedicationHistoryRow key={i} history={history} />
                  ))
              )}
            </tbody>
          </table>
        </>
      )}
      <Button onClick={closeModal} text="Close" colour="red" />
    </ReactModal>
  );
}

function MedicationHistoryRow({
  history,
}: {
  history: MedicationHistoryRowData;
}) {
  const {
    approval_name,
    doctor_name,
    patient_name,
    qty_changed,
    qty_remaining,
    date,
  } = history;
  return (
    <tr>
      <td>{approval_name}</td>
      <td>{doctor_name}</td>
      <td>{patient_name}</td>
      <td className={`${qty_changed >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {qty_changed >= 0 ? `+${qty_changed}` : qty_changed}
      </td>
      <td>{qty_remaining}</td>
      <td>{formatDate(date, 'datetime')}</td>
    </tr>
  );
}
