import { Button } from '@/components/Button';
import { getMedicationReviewById } from '@/data/medicationReview/getMedicationReview';
import { MedicationReview } from '@/types/MedicationReview';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

export function HistoryMedicationModal({
  viewMedicationId,
}: {
  viewMedicationId: string | null;
}) {
  const [medicationHistory, setMedicationHistory] = useState<
    MedicationReview[]
  >([]);
  const router = useRouter();
  useEffect(() => {
    if (viewMedicationId !== null) {
      getMedicationReviewById(viewMedicationId)
        .then(setMedicationHistory)
        .catch(error => console.error('Error loading page:\n', error));
    }
  }, [viewMedicationId]);
  return (
    <ReactModal isOpen={viewMedicationId != null} ariaHideApp={false}>
      <h2>
        {`View Medication ${
          medicationHistory.length == 0
            ? viewMedicationId
            : medicationHistory[0].medicine.medicine_name
        } History`}
      </h2>
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
          {medicationHistory
            .sort((a, b) => (a.date > b.date ? -1 : 1))
            .map(history => (
              <MedicationHistoryRow key={history.id} history={history} />
            ))}
        </tbody>
      </table>
      <Button onClick={() => router.back()} text="Close" />
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
