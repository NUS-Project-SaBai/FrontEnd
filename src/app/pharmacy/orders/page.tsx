'use client';
import { Button } from '@/components/Button';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchbar } from '@/components/PatientSearchbar';
import { VILLAGES_AND_ALL } from '@/constants';
import { patchOrder } from '@/data/order/patchOrder';
import { useLoadingState } from '@/hooks/useLoadingState';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { formatDate } from '@/utils/formatDate';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAllPatientMedicationOrders } from './api';

type OrderRowData = {
  patient: {
    patient_id: string;
    name: string;
    picture_url: string;
    village_prefix: VillagePrefix;
  };
  data: {
    orders: {
      id: number;
      medication_name: string;
      medication_code: string;
      quantity_changed: number;
      notes: string;
    }[];
    diagnoses: { category: string; details: string }[];
    visit_id: number;
    visit_date: string;
  }[];
};

export default function OrdersPage() {
  const [orderRowData, setOrderRowData] = useState<OrderRowData[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);

  useEffect(() => {
    const fetchPendingOrders = withLoading(async () => {
      const result = await fetchAllPatientMedicationOrders();
      setOrderRowData(result);
    });

    fetchPendingOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadingPage isLoading={isLoading} message="Loading Pending Orders...">
      <div className="p-2">
        <h1>Orders</h1>
        <Suspense>
          <PatientSearchbar
            data={orderRowData}
            setFilteredItems={setOrderRowData}
            filterFunction={query => item =>
              item.patient.patient_id
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              item.patient.name.toLowerCase().includes(query.toLowerCase())
            }
            isLoading={isLoading}
          />
        </Suspense>
        <div className="pt-4">
          <table className="w-full text-left">
            <thead className="border-b-2">
              <tr>
                <th>
                  <p>ID / Full Name</p>
                  <p>Photo</p>
                </th>
                <th>
                  <p>Visit On</p>
                </th>
                <th>Diagnoses</th>
                <th>Prescriptions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orderRowData.length == 0 ? (
                <tr>
                  <td className="col-span-4">No Pending Orders</td>
                </tr>
              ) : (
                orderRowData.map((x, index) => (
                  <OrderRow
                    key={x.patient?.patient_id || index}
                    orderRowData={x}
                    removeNonPendingOrder={() => {}}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LoadingPage>
  );
}

function OrderRow({
  orderRowData: { patient, data },
  removeNonPendingOrder,
}: {
  orderRowData: OrderRowData;
  removeNonPendingOrder: (id: number) => void;
}) {
  const onPatchError = (err: Error, medicine_name: string) => {
    toast.error(() => (
      <p>
        {err.message}
        <br />
        <br />
        <b>Patient: </b>
        {patient.name}
        <br />
        <b>Medicine: </b>
        {medicine_name}
      </p>
    ));
  };

  return (
    <>
      <tr>
        {/* rowSpan is data.length + 1 because the current row has no data. */}
        <td className="px-0" rowSpan={data.length + 1}>
          <p
            className={
              'font-bold ' + VILLAGES_AND_ALL[patient.village_prefix].color
            }
          >
            {patient.patient_id}
          </p>
          <p className="font-semibold">{patient.name}</p>
          <Image
            alt="Patient Image"
            src={patient.picture_url}
            className="h-24 w-20 object-cover"
            height={80}
            width={80}
          />
        </td>
      </tr>
      {data.map(({ visit_id, visit_date, orders, diagnoses }) => (
        <tr key={visit_id}>
          <td>
            <p className="text-nowrap">
              {visit_date ? formatDate(visit_date, 'datetime') : 'No Date'}
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
                      <b>{o.medication_name}: </b>
                      {Math.abs(o.quantity_changed)}
                    </p>
                    <p>
                      <b>Dosage Instruction: </b>
                      {o.notes}
                    </p>
                    <p>
                      <b> Code: </b>
                      {o.medication_code || 'N/A'}
                    </p>
                  </div>
                  <ApproveRejectOrderButton
                    handleApproveOrder={async () => {
                      await patchOrder(o.id.toString(), 'APPROVED')
                        .then(() => removeNonPendingOrder(o.id))
                        .catch(err => onPatchError(err, o.medication_name));
                    }}
                    handleCancelOrder={async () => {
                      await patchOrder(o.id.toString(), 'CANCELLED')
                        .then(() => removeNonPendingOrder(o.id))
                        .catch(err => onPatchError(err, o.medication_name));
                    }}
                  />
                </div>
              ))}
            </div>
          </td>
        </tr>
      ))}
    </>
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
