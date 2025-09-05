'use client';
import { Button } from '@/components/Button';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import { VILLAGES_AND_ALL } from '@/constants';
import { getPendingOrder } from '@/data/order/getOrder';
import { patchOrder } from '@/data/order/patchOrder';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Diagnosis } from '@/types/Diagnosis';
import { OrderWithDiagnoses } from '@/types/Order';
import { Patient } from '@/types/Patient';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [orders, setOrders] = useState<Record<string, OrderWithDiagnoses[]>>(
    {}
  );
  const [orderRowData, setOrderRowData] = useState<OrderRowData[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);

  useEffect(() => {
    const fetchPendingOrders = withLoading(async () => {
      const ordersWithDiagnoses = await getPendingOrder();

      const tmpOrder: Record<string, OrderWithDiagnoses[]> = {};
      ordersWithDiagnoses.forEach(order => {
        const patientId = order.visit.patient.patient_id;
        if (!tmpOrder[patientId]) {
          tmpOrder[patientId] = [];
        }
        tmpOrder[patientId].push(order);
      });
      setOrders(tmpOrder);
    });

    fetchPendingOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tmpOrderRowData: OrderRowData[] = [];
    patients.forEach(patient => {
      const patientOrders = orders[patient.patient_id] || [];

      // flatten all diagnoses across all orders for this patient
      const diagnoses = patientOrders.flatMap(order => order.diagnoses);

      tmpOrderRowData.push({
        patient: patient,
        diagnoses: diagnoses,
        orders: patientOrders,
      });
    });
    console.log(tmpOrderRowData);
    setOrderRowData(tmpOrderRowData.filter(x => x.orders.length > 0));
  }, [patients, orders]);

  return (
    <LoadingPage isLoading={isLoading} message="Loading Pending Orders...">
      <div className="p-2">
        <h1>Orders</h1>
        <Suspense>
          <PatientSearchInput setPatients={setPatients} />
        </Suspense>
        <div className="pt-4">
          <table className="w-full text-left">
            <thead className="border-b-2">
              <tr>
                <th>Photo</th>
                <th>
                  <p>ID / Full Name</p>
                  <p>Visit On</p>
                </th>
                <th>Diagnoses</th>
                <th>Prescriptions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orderRowData.map((x, index) => (
                <OrderRow
                  key={x.patient?.identification_number || index}
                  {...x}
                  removeNonPendingOrder={id => {
                    if (orders[x.patient.patient_id] == undefined) return;
                    const newOrders = orders[x.patient.patient_id].filter(
                      o => o.id != id
                    );
                    if (newOrders.length == 0) {
                      const tmp = { ...orders };
                      delete tmp[x.patient.patient_id];
                      setOrders(tmp);
                    } else {
                      setOrders(prev => ({
                        ...prev,
                        [x.patient.patient_id]: newOrders,
                      }));
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LoadingPage>
  );
}

type OrderRowData = {
  patient: Patient;
  diagnoses: Diagnosis[];
  orders: OrderWithDiagnoses[];
};
function OrderRow({
  patient,
  diagnoses,
  orders,
  removeNonPendingOrder,
}: OrderRowData & { removeNonPendingOrder: (id: number) => void }) {
  const onPatchError = (err: Error, o: OrderWithDiagnoses) => {
    toast.error(() => (
      <p>
        {err.message}
        <br />
        <br />
        <b>Patient: </b>
        {o.visit.patient.patient_id}
        <br />
        <b>Medicine: </b>
        {o.medication_review.medicine.medicine_name}
      </p>
    ));
  };
  return (
    <tr>
      <td className="px-0">
        <Image
          alt="Patient Image"
          src={patient.picture_url}
          className="h-24 w-20 object-cover"
          height={80}
          width={80}
        />
      </td>
      <td>
        <p
          className={
            'font-bold ' + VILLAGES_AND_ALL[patient.village_prefix].color
          }
        >
          {patient.patient_id}
        </p>
        <p className="font-semibold">{patient.name}</p>
        <p className="text-nowrap text-gray-400">
          {orders == undefined || orders[0] == undefined
            ? 'Error Getting Date'
            : new Date(orders[0].visit.date).toLocaleString()}
        </p>
      </td>
      <td className="min-w-60 text-gray-700">
        {diagnoses.map((d, i) => (
          <li key={i} className="list-none text-sm">
            <b>Diagnosis {i + 1}</b>
            <p>Category: {d.category}</p>
            <p>{d.details}</p>
          </li>
        ))}
      </td>
      <td className="p-0">
        <div className="flex flex-col divide-y-2">
          {orders.map((o, i) => (
            <div
              key={i}
              className="flex justify-between p-1.5 text-sm text-gray-700 hover:bg-slate-100"
            >
              <div>
                <p>
                  <b>{o.medication_review.medicine.medicine_name}: </b>
                  {Math.abs(o.medication_review.quantity_changed)}
                </p>
                <p>
                  <b>Dosage Instruction: </b>
                  {o.notes}
                </p>
                <p>
                  <b> Code: </b>
                  {o.medication_review.medicine.code || 'N/A'}
                </p>
              </div>
              <ApproveRejectOrderButton
                handleApproveOrder={async () => {
                  await patchOrder(o.id.toString(), 'APPROVED')
                    .then(() => removeNonPendingOrder(o.id))
                    .catch(err => onPatchError(err, o));
                }}
                handleCancelOrder={async () => {
                  await patchOrder(o.id.toString(), 'CANCELLED')
                    .then(() => removeNonPendingOrder(o.id))
                    .catch(err => onPatchError(err, o));
                }}
              />
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

function ApproveRejectOrderButton({
  handleApproveOrder,
  handleCancelOrder,
}: {
  handleApproveOrder: () => void;
  handleCancelOrder: () => void;
}) {
  const { isLoading: isUpdating, withLoading } = useLoadingState(false);
  const [actionStr, setActionStr] = useState('');
  return isUpdating ? (
    <LoadingUI message={actionStr} />
  ) : (
    <div>
      <Button
        text=""
        colour="green"
        Icon={<CheckIcon className="h-5 w-5" />}
        onClick={withLoading(async () => {
          setActionStr('Approving Order...');
          await handleApproveOrder();
        })}
      />
      <Button
        text=""
        colour="red"
        Icon={<XMarkIcon className="h-5 w-5" />}
        onClick={withLoading(async () => {
          setActionStr('Cancelling Order...');
          await handleCancelOrder();
        })}
      />
    </div>
  );
}
