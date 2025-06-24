'use client';
import { Button } from '@/components/Button';
import { LoadingUI } from '@/components/LoadingUI';
import { getMedicationReviewById } from '@/data/medicationReview/getMedicationReview';
import { useLoadingState } from '@/hooks/useLoadingState';
import { MedicationReview } from '@/types/MedicationReview';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

export function HistoryMedicationModal() {
  const [medicationHistory, setMedicationHistory] = useState<
    MedicationReview[]
  >([]);
  const { isLoading, withLoading } = useLoadingState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMedicationId = searchParams.get('view');

  useEffect(() => {
    if (viewMedicationId !== null) {
      const fetchMedicationHistory = withLoading(async () => {
        try {
          const result = await getMedicationReviewById(
            viewMedicationId.toString()
          );
          setMedicationHistory(result);
        } catch (error) {
          console.error('Error fetching medication history:', error);
          setMedicationHistory([]);
        }
      });

      fetchMedicationHistory();
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
      <h2>
        {`View Medication ${
          medicationHistory.length === 0
            ? ''
            : medicationHistory[0]?.medicine.medicine_name
        } History`}
      </h2>
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
                  .map(history => (
                    <MedicationHistoryRow key={history.id} history={history} />
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

function MedicationHistoryRow({ history }: { history: MedicationReview }) {
  const qty_changed = history.quantity_changed;
  return (
    <tr>
      <td>{history.approval.nickname}</td>
      <td>
        {history.order == undefined ||
        history.order.consult == undefined ||
        typeof history.order.consult == 'number'
          ? '-'
          : history.order.consult.doctor.nickname}
      </td>
      <td>
        {history.order == undefined ||
        history.order.consult == undefined ||
        typeof history.order.consult == 'number'
          ? '-'
          : history.order.consult.patient.name}
      </td>
      <td className={`${qty_changed >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {qty_changed >= 0 ? `+${qty_changed}` : qty_changed}
      </td>
      <td>{history.quantity_remaining}</td>
      <td>{new Date(history.date).toLocaleString()}</td>
    </tr>
  );
}
