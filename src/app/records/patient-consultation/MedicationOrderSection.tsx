import { Button } from '@/components/Button';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Patient } from '@/types/Patient';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { MedicationOrderForm } from './MedicationOrderForm';
import { MedicationOrderTable } from './MedicationOrderTable';

export function MedicationOrderSection({
  patient,
}: {
  patient: Patient | null;
}) {
  const [selectedOrder, setSelectedOrder] =
    useState<ConsultMedicationOrder | null>(null);
  return (
    <Controller
      name="orders"
      render={({ field: { value, onChange } }) => (
        <>
          <div className="rounded-lg bg-gray-50 p-2 shadow">
            <h2>Order</h2>
            <hr />
            {value == undefined ? (
              <p className="py-2">No orders yet</p>
            ) : (
              <MedicationOrderTable
                consultOrders={value}
                editConsultOrder={setSelectedOrder}
                deleteConsultOrder={consult => {
                  const tmp = [...value];
                  tmp.splice(
                    tmp.findIndex(val => val.medication == consult.medication),
                    1
                  );
                  onChange(tmp);
                }}
              />
            )}
            <Button
              text="Add Order"
              colour="green"
              onClick={() => {
                setSelectedOrder({
                  index: undefined,
                  medication: '',
                  quantity: undefined,
                  notes: '',
                });
              }}
            />
          </div>
          <MedicationOrderForm
            selectedOrder={selectedOrder}
            orderList={value}
            setOrder={onChange}
            closeForm={() => setSelectedOrder(null)}
            patient={patient}
          />
        </>
      )}
    />
  );
}
