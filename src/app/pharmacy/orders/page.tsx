'use client';
import { Button } from '@/components/Button';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import { VILLAGES } from '@/constants';
import { getPendingOrder } from '@/data/order/getOrder';
import { patchOrder } from '@/data/order/patchOrder';
import { Diagnosis } from '@/types/Diagnosis';
import { Order } from '@/types/Order';
import { Patient } from '@/types/Patient';
import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [orders, setOrders] = useState<Record<string, Order[]>>({});
  const [diagnoses, setDiagnoses] = useState<Record<string, Diagnosis[]>>({});
  const [orderRowData, setOrderRowData] = useState<OrderRowData[]>([]);

  useEffect(() => {
    getPendingOrder().then(data => {
      const tmpOrder: Record<string, Order[]> = {};
      data.orders.forEach(order => {
        const patientId = order.visit.patient.patient_id;
        if (!tmpOrder[patientId]) {
          tmpOrder[patientId] = [];
        }
        tmpOrder[patientId].push(order);
      });
      setOrders(tmpOrder);

      const tmpDiagnosis: Record<string, Diagnosis[]> = {};
      data.diagnoses.forEach(diagnosis => {
        const patientId = diagnosis.consult.patient?.patient_id;
        if (!patientId) {
          return;
        }
        if (!tmpDiagnosis[patientId]) {
          tmpDiagnosis[patientId] = [];
        }
        tmpDiagnosis[patientId].push(diagnosis);
      });
      setDiagnoses(tmpDiagnosis);
    });
  }, []);

  useEffect(() => {
    const tmpOrderRowData: OrderRowData[] = [];
    patients.forEach(patient => {
      tmpOrderRowData.push({
        patient: patient,
        diagnoses: diagnoses[patient.patient_id] || [],
        orders: orders[patient.patient_id] || [],
      });
    });

    setOrderRowData(tmpOrderRowData.filter(x => x.orders.length > 0));
  }, [patients, orders, diagnoses]);

  return (
    <div className="p-2">
      <h1>Orders</h1>
      <PatientSearchInput setPatients={setPatients} />
      <div>
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
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody className="divide-y">
            {orderRowData.map((x, index) => (
              <OrderRow
                key={x.patient?.identification_number || index}
                {...x}
                removeNonPendingOrder={id => {
                  console.log(
                    'Removing Order',
                    id,
                    orders[x.patient.patient_id]
                  );
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
  );
}

type OrderRowData = {
  patient: Patient;
  diagnoses: Diagnosis[];
  orders: Order[];
};
function OrderRow({
  patient,
  diagnoses,
  orders,
  removeNonPendingOrder,
}: OrderRowData & { removeNonPendingOrder: (id: number) => void }) {
  return (
    <tr>
      <td className="px-0">
        <Image
          alt="Patient Image"
          src={patient.picture}
          className="h-24 w-20 object-cover"
          height={80}
          width={80}
        />
      </td>
      <td>
        <p className={'font-bold ' + VILLAGES[patient.village_prefix].color}>
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
              </div>
              <div>
                <Button
                  text=""
                  colour="green"
                  Icon={<CheckIcon className="h-5 w-5" />}
                  onClick={() =>
                    patchOrder(o.id.toString(), 'APPROVED').then(() =>
                      removeNonPendingOrder(o.id)
                    )
                  }
                />
                <Button
                  text=""
                  colour="red"
                  Icon={<XMarkIcon className="h-5 w-5" />}
                  onClick={() =>
                    patchOrder(o.id.toString(), 'CANCELLED').then(() =>
                      removeNonPendingOrder(o.id)
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}
